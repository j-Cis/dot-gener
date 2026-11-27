// @project-metadata
// Path: site/screen/loci/render-wspolne.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
/** Wspólne dla rysowania LOCI w SVG i na Canvas: wymiary w pikselach ekranu. */ /** Kreski stylów linii w px ekranu. */ export const KRESKI = {
  dashed: [
    6,
    4
  ],
  dotted: [
    1,
    3
  ],
  solid: []
};
/** Grot w px ekranu przy skali 1: [długość, szerokość]. */ export const GROT = [
  10,
  7
];
/**
 * Odcinki symbolu punktu (px ekranu, środek w 0,0) dla "rays24" i "cross";
 * "circle" i "dot" rysuje się okręgiem o promieniu wielkość/2 (kropka: wypełniony, wielkość/4).
 */ export function odcinkiSymbolu(symbol, wielkosc) {
  const r = wielkosc / 2;
  const katy = symbol === "rays24" ? Array.from({
    length: 12
  }, (_, i)=>i * 15) : symbol === "cross" ? [
    0,
    90
  ] : [];
  return katy.map((k)=>{
    const a = k * Math.PI / 180;
    const x = r * Math.cos(a), y = r * Math.sin(a);
    return [
      -x,
      -y,
      x,
      y
    ];
  });
}
/** Kreski stylu linii elementu rysunku: wielokrotności grubości, w jednostkach rysunku. */ export function kreskiRysunku(styl, grubosc) {
  return styl === "dashed" ? [
    4 * grubosc,
    3 * grubosc
  ] : styl === "dotted" ? [
    grubosc,
    2 * grubosc
  ] : [];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXdzcG9sbmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXdzcG9sbmUudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IExpbmVTdHlsZSwgUG9pbnRTeW1ib2wgfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2xvY2kvZWxlbWVudC9MT0NJQm9keUVsZW1lbnQudHNcIjtcblxuLyoqIFdzcMOzbG5lIGRsYSByeXNvd2FuaWEgTE9DSSB3IFNWRyBpIG5hIENhbnZhczogd3ltaWFyeSB3IHBpa3NlbGFjaCBla3JhbnUuICovXG5cbi8qKiBLcmVza2kgc3R5bMOzdyBsaW5paSB3IHB4IGVrcmFudS4gKi9cbmV4cG9ydCBjb25zdCBLUkVTS0k6IFJlYWRvbmx5PFJlY29yZDxMaW5lU3R5bGUsIHJlYWRvbmx5IG51bWJlcltdPj4gPSB7XG5cdGRhc2hlZDogWyA2LCA0IF0sXG5cdGRvdHRlZDogWyAxLCAzIF0sXG5cdHNvbGlkOiBbXSxcbn07XG5cbi8qKiBHcm90IHcgcHggZWtyYW51IHByenkgc2thbGkgMTogW2TFgnVnb8WbxIcsIHN6ZXJva2/Fm8SHXS4gKi9cbmV4cG9ydCBjb25zdCBHUk9UID0gWyAxMCwgNyBdIGFzIGNvbnN0O1xuXG4vKipcbiAqIE9kY2lua2kgc3ltYm9sdSBwdW5rdHUgKHB4IGVrcmFudSwgxZtyb2RlayB3IDAsMCkgZGxhIFwicmF5czI0XCIgaSBcImNyb3NzXCI7XG4gKiBcImNpcmNsZVwiIGkgXCJkb3RcIiByeXN1amUgc2nEmSBva3LEmWdpZW0gbyBwcm9taWVuaXUgd2llbGtvxZvEhy8yIChrcm9wa2E6IHd5cGXFgm5pb255LCB3aWVsa2/Fm8SHLzQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gb2RjaW5raVN5bWJvbHUoIHN5bWJvbDogUG9pbnRTeW1ib2wsIHdpZWxrb3NjOiBudW1iZXIgKTogcmVhZG9ubHkgKHJlYWRvbmx5IFsgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyIF0pW10ge1xuXHRjb25zdCByID0gd2llbGtvc2MgLyAyO1xuXHRjb25zdCBrYXR5ID0gc3ltYm9sID09PSBcInJheXMyNFwiID8gQXJyYXkuZnJvbSggeyBsZW5ndGg6IDEyIH0sICggXywgaSApID0+IGkgKiAxNSApIDogc3ltYm9sID09PSBcImNyb3NzXCIgPyBbIDAsIDkwIF0gOiBbXTtcblx0cmV0dXJuIGthdHkubWFwKCAoIGsgKSA9PiB7XG5cdFx0Y29uc3QgYSA9ICggayAqIE1hdGguUEkgKSAvIDE4MDtcblx0XHRjb25zdCB4ID0gciAqIE1hdGguY29zKCBhICksIHkgPSByICogTWF0aC5zaW4oIGEgKTtcblx0XHRyZXR1cm4gWyAteCwgLXksIHgsIHkgXSBhcyBjb25zdDtcblx0fSApO1xufVxuXG4vKiogS3Jlc2tpIHN0eWx1IGxpbmlpIGVsZW1lbnR1IHJ5c3Vua3U6IHdpZWxva3JvdG5vxZtjaSBncnVib8WbY2ksIHcgamVkbm9zdGthY2ggcnlzdW5rdS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBrcmVza2lSeXN1bmt1KCBzdHlsOiBMaW5lU3R5bGUsIGdydWJvc2M6IG51bWJlciApOiBudW1iZXJbXSB7XG5cdHJldHVybiBzdHlsID09PSBcImRhc2hlZFwiID8gWyA0ICogZ3J1Ym9zYywgMyAqIGdydWJvc2MgXSA6IHN0eWwgPT09IFwiZG90dGVkXCIgPyBbIGdydWJvc2MsIDIgKiBncnVib3NjIF0gOiBbXTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsMkNBQTJDO0FBQzNDLDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFDL0MsaURBQWlEO0FBSWpELDhFQUE4RSxHQUU5RSxxQ0FBcUMsR0FDckMsT0FBTyxNQUFNLFNBQXlEO0VBQ3JFLFFBQVE7SUFBRTtJQUFHO0dBQUc7RUFDaEIsUUFBUTtJQUFFO0lBQUc7R0FBRztFQUNoQixPQUFPLEVBQUU7QUFDVixFQUFFO0FBRUYseURBQXlELEdBQ3pELE9BQU8sTUFBTSxPQUFPO0VBQUU7RUFBSTtDQUFHLENBQVU7QUFFdkM7OztDQUdDLEdBQ0QsT0FBTyxTQUFTLGVBQWdCLE1BQW1CLEVBQUUsUUFBZ0I7RUFDcEUsTUFBTSxJQUFJLFdBQVc7RUFDckIsTUFBTSxPQUFPLFdBQVcsV0FBVyxNQUFNLElBQUksQ0FBRTtJQUFFLFFBQVE7RUFBRyxHQUFHLENBQUUsR0FBRyxJQUFPLElBQUksTUFBTyxXQUFXLFVBQVU7SUFBRTtJQUFHO0dBQUksR0FBRyxFQUFFO0VBQ3pILE9BQU8sS0FBSyxHQUFHLENBQUUsQ0FBRTtJQUNsQixNQUFNLElBQUksQUFBRSxJQUFJLEtBQUssRUFBRSxHQUFLO0lBQzVCLE1BQU0sSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFFLElBQUssSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFFO0lBQy9DLE9BQU87TUFBRSxDQUFDO01BQUcsQ0FBQztNQUFHO01BQUc7S0FBRztFQUN4QjtBQUNEO0FBRUEseUZBQXlGLEdBQ3pGLE9BQU8sU0FBUyxjQUFlLElBQWUsRUFBRSxPQUFlO0VBQzlELE9BQU8sU0FBUyxXQUFXO0lBQUUsSUFBSTtJQUFTLElBQUk7R0FBUyxHQUFHLFNBQVMsV0FBVztJQUFFO0lBQVMsSUFBSTtHQUFTLEdBQUcsRUFBRTtBQUM1RyJ9