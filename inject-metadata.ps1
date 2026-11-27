# @project-metadata
# Path: inject-metadata.ps1
# Author: Jan Roman Cisowski
# ORCID: https://orcid.org/0009-0009-2907-3792
# Repository: https://github.com/j-Cis/dot-gener

# pwsh -NoProfile -ExecutionPolicy Bypass -File .\inject-metadata.ps1 [-DryRun]
#
# Wstawia (albo odświeża) metryczkę na początku plików projektu.
#   -DryRun  tylko wypisuje pliki, które by się zmieniły; niczego nie zapisuje.
#
# Plik jest zapisywany tylko wtedy, gdy jego treść naprawdę się zmienia.
# Zachowuje końce linii (CRLF/LF) i BOM każdego pliku.
# Deklaracja XML (<?xml …?>) zostaje pierwszą linią — metryczka idzie za nią.
param(
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# Wyjście gita jako UTF-8 (polskie znaki w ścieżkach).
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)

$author = "Jan Roman Cisowski"
$orcid = "0009-0009-2907-3792"
$marker = "@project-metadata"
$repository = "https://github.com/j-Cis/dot-gener"

# Ścieżki pomijane (początek ścieżki względem katalogu repozytorium).
$skipPrefixes = @("_to_delete/")

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

# Istniejąca metryczka na początku treści (tylko ona — nic przed nią ani po niej):
#   /* … @project-metadata … */      — w obrębie jednego komentarza blokowego
#   <!-- … @project-metadata … -->   — w obrębie jednego komentarza HTML
#   // @project-metadata  + kolejne linie pól (Path:, Author:, ORCID:, Repository:, Created:, Modified:)
$headerPattern = '(?s)\A(?:/\*(?:(?!\*/).)*?@project-metadata.*?\*/|<!--(?:(?!-->).)*?@project-metadata.*?-->|(?://|#|--) @project-metadata[^\r\n]*(?:\r?\n(?://|#|--) (?:Path|Author|ORCID|Repository|Created|Modified):[^\r\n]*)*)\s*'

# Deklaracja XML na samym początku pliku.
$xmlDeclPattern = '\A<\?xml[^>]*\?>[ \t]*(?:\r?\n)?'

# Pliki śledzone przez Git oraz nowe, jeszcze niedodane (bez ignorowanych przez .gitignore).
$files = @(git -c core.quotepath=off ls-files --cached --others --exclude-standard)

if ($LASTEXITCODE -ne 0) {
    throw "Nie można odczytać listy plików Git."
}

$files = @($files | Sort-Object -Unique)

$utf8 = [Text.UTF8Encoding]::new($false)
$changed = 0
$unchanged = 0

foreach ($path in $files) {
    $skip = $false
    foreach ($prefix in $skipPrefixes) {
        if ($path.StartsWith($prefix)) { $skip = $true }
    }
    if ($skip) { continue }

    $extension = [IO.Path]::GetExtension($path).ToLowerInvariant()

    if (-not $commentStyles.ContainsKey($extension)) {
        continue
    }

    $style = $commentStyles[$extension]

    $fullPath = Join-Path (Get-Location) $path

    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        continue
    }

    # Odczyt bajtów: BOM zostaje taki, jaki był.
    $bytes = [IO.File]::ReadAllBytes($fullPath)
    $hasBom = $bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF
    $start = if ($hasBom) { 3 } else { 0 }
    $original = $utf8.GetString($bytes, $start, $bytes.Length - $start)

    $newline = if ($original.Contains("`r`n")) { "`r`n" } else { "`n" }

    # Deklaracja XML zostaje na początku.
    $prolog = ""
    $body = $original
    $xmlDecl = [regex]::Match($original, $xmlDeclPattern)
    if ($xmlDecl.Success) {
        $prolog = $xmlDecl.Value
        if (-not $prolog.EndsWith("`n")) { $prolog += $newline }
        $body = $original.Substring($xmlDecl.Length)
    }

    # Usuń istniejącą metryczkę przed ponownym wstawieniem.
    $body = [regex]::Replace($body, $headerPattern, '')

    # Treść metryczki.
    $lines = @(
        $marker
        "Path: $($path.Replace('\', '/'))"
        "Author: $author"
        "ORCID: https://orcid.org/$orcid"
        "Repository: $repository"
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

    $header = $header.Replace("`n", $newline)
    $result = $prolog + $header + $newline + $newline + $body

    if ([string]::Equals($result, $original, [StringComparison]::Ordinal)) {
        $unchanged++
        continue
    }

    $changed++

    if ($DryRun) {
        Write-Host "ZMIANA  $path" -ForegroundColor Yellow
        continue
    }

    [IO.File]::WriteAllText($fullPath, $result, [Text.UTF8Encoding]::new($hasBom))
    Write-Host "OK      $path" -ForegroundColor Green
}

$summary = if ($DryRun) { "Do zmiany" } else { "Zmienione" }
Write-Host "`n${summary}: $changed, bez zmian: $unchanged." -ForegroundColor Cyan
