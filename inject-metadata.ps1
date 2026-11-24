# pwsh -NoProfile -ExecutionPolicy Bypass -File .\inject-metadata.ps1
$ErrorActionPreference = "Stop"

$author = "Jan Roman Cisowski"
$orcid = "0009-0009-2907-3792"
$marker = "@project-metadata"
$repository = "https://github.com/j-Cis/dot-gener"

# Rozszerzenia i składnia komentarzy.
$commentStyles = @{
    ".ts"     = "line"
    ".tsx"    = "line"
    ".js"     = "line"
    ".jsx"    = "line"
    ".mjs"    = "line"
    ".cjs"    = "line"
    ".rs"     = "line"
    ".go"     = "line"
    ".py"     = "hash"
    ".ps1"    = "hash"
    ".psm1"   = "hash"
    ".sh"     = "hash"
    ".toml"   = "hash"
    ".yaml"   = "hash"
    ".yml"    = "hash"
    ".css"    = "block"
    ".scss"   = "block"
    ".html"   = "html"
    ".htm"    = "html"
    ".xml"    = "html"
    ".svg"    = "html"
    ".md"     = "html"
    ".sql"    = "sql"
    ".jsonc"  = "line"
}

# Pobranie plików śledzonych przez Git.
$files = @(git ls-files)

if ($LASTEXITCODE -ne 0) {
    throw "Nie można odczytać listy plików Git."
}

foreach ($path in $files) {
    $extension = [IO.Path]::GetExtension($path).ToLowerInvariant()

    if (-not $commentStyles.ContainsKey($extension)) {
        continue
    }

    $style = $commentStyles[$extension]

    # Odczyt aktualnej zawartości.
    $fullPath = Join-Path (Get-Location) $path

    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        continue
    }

    $content = [IO.File]::ReadAllText($fullPath)

    # Usuń istniejącą metryczkę przed ponownym wstawieniem.
    if ($content.Contains($marker)) {
    $content = [regex]::Replace(
        $content,
        '(?ms)\A(?:/\*.*?@project-metadata.*?\*/|<!--.*?@project-metadata.*?-->|(?:(?://|#|--).*\r?\n)*?(?://|#|--) @project-metadata[^\r\n]*(?:\r?\n(?://|#|--)[^\r\n]*)*)\s*',
        ''
    )
}

    # Data pierwszego dodania.
    $created = @(
      git --literal-pathspecs log --follow --format=%aI --diff-filter=A -- $path 2>$null
    ) | Select-Object -Last 1

    $modified = @(
      git --literal-pathspecs log -1 --follow --format=%aI -- $path 2>$null
    ) | Select-Object -First 1

    if (-not $created) { $created = "unknown" }
    if (-not $modified) { $modified = "unknown" }

    # Treść metryczki.
    $lines = @(
        $marker
        "Path: $($path.Replace('\', '/'))"
        "Author: $author"
        "ORCID: https://orcid.org/$orcid"
        "Repository: $repository"
       # "Created: $created"
       # "Modified: $modified"
    )

    switch ($style) {
        "line" {
            $header = ($lines | ForEach-Object { "// $_" }) -join "`n"
        }
        "hash" {
            $header = ($lines | ForEach-Object { "# $_" }) -join "`n"
        }
        "sql" {
            $header = ($lines | ForEach-Object { "-- $_" }) -join "`n"
        }
        "block" {
            $header = "/*`n" +
                (($lines | ForEach-Object { " * $_" }) -join "`n") +
                "`n */"
        }
        "html" {
            $header = "<!--`n" +
                (($lines | ForEach-Object { "  $_" }) -join "`n") +
                "`n-->"
        }
    }

    # Wstawienie na początek pliku.
    $newline = if ($content.Contains("`r`n")) { "`r`n" } else { "`n" }
    $header = $header.Replace("`n", $newline)

    [IO.File]::WriteAllText(
        $fullPath,
        $header + $newline + $newline + $content,
        [Text.UTF8Encoding]::new($false)
    )

    Write-Host "OK  $path" -ForegroundColor Green
}

Write-Host "`nGotowe." -ForegroundColor Cyan
