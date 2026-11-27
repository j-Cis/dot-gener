// @project-metadata
// Path: web/listwy.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * Skrypt dla przeglądarki: sumy wysokości przyklejonych listew → zmienne CSS na <html>:
 *   [data-listwa="gora"] (np. GuideBar) → --listwa-gora
 *   [data-listwa="dol"]  (np. FootBar)  → --listwa-dol
 * Z nich Table liczy wiersze "fill…" (wysokość ekranu między listwami). ResizeObserver
 * odświeża wartości, gdy listwa zmieni wysokość (np. pojawi się pasek przewijania).
 */
export const LISTWY =
	`(()=>{const r=document.documentElement;const ustaw=()=>{for(const s of["gora","dol"]){let h=0;for(const e of document.querySelectorAll('[data-listwa="'+s+'"]'))h+=e.getBoundingClientRect().height;r.style.setProperty("--listwa-"+s,h+"px");}};addEventListener("DOMContentLoaded",()=>{const o=new ResizeObserver(ustaw);for(const e of document.querySelectorAll("[data-listwa]"))o.observe(e,{box:"border-box"});ustaw();});})();`;
