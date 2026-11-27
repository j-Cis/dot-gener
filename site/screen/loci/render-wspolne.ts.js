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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXdzcG9sbmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXdzcG9sbmUudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IExpbmVTdHlsZSB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvbG9jaS9hdHRyaWJ1dGUvTE9DSUF4aXNQcm9wcy50c1wiO1xuaW1wb3J0IHR5cGUgeyBQb2ludFN5bWJvbCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvbG9jaS9hdHRyaWJ1dGUvTE9DSVBvaW50UHJvcHMudHNcIjtcblxuLyoqIFdzcMOzbG5lIGRsYSByeXNvd2FuaWEgTE9DSSB3IFNWRyBpIG5hIENhbnZhczogd3ltaWFyeSB3IHBpa3NlbGFjaCBla3JhbnUuICovXG5cbi8qKiBLcmVza2kgc3R5bMOzdyBsaW5paSB3IHB4IGVrcmFudS4gKi9cbmV4cG9ydCBjb25zdCBLUkVTS0k6IFJlYWRvbmx5PFJlY29yZDxMaW5lU3R5bGUsIHJlYWRvbmx5IG51bWJlcltdPj4gPSB7XG5cdGRhc2hlZDogWyA2LCA0IF0sXG5cdGRvdHRlZDogWyAxLCAzIF0sXG5cdHNvbGlkOiBbXSxcbn07XG5cbi8qKiBHcm90IHcgcHggZWtyYW51IHByenkgc2thbGkgMTogW2TFgnVnb8WbxIcsIHN6ZXJva2/Fm8SHXS4gKi9cbmV4cG9ydCBjb25zdCBHUk9UID0gWyAxMCwgNyBdIGFzIGNvbnN0O1xuXG4vKipcbiAqIE9kY2lua2kgc3ltYm9sdSBwdW5rdHUgKHB4IGVrcmFudSwgxZtyb2RlayB3IDAsMCkgZGxhIFwicmF5czI0XCIgaSBcImNyb3NzXCI7XG4gKiBcImNpcmNsZVwiIGkgXCJkb3RcIiByeXN1amUgc2nEmSBva3LEmWdpZW0gbyBwcm9taWVuaXUgd2llbGtvxZvEhy8yIChrcm9wa2E6IHd5cGXFgm5pb255LCB3aWVsa2/Fm8SHLzQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gb2RjaW5raVN5bWJvbHUoIHN5bWJvbDogUG9pbnRTeW1ib2wsIHdpZWxrb3NjOiBudW1iZXIgKTogcmVhZG9ubHkgKHJlYWRvbmx5IFsgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyIF0pW10ge1xuXHRjb25zdCByID0gd2llbGtvc2MgLyAyO1xuXHRjb25zdCBrYXR5ID0gc3ltYm9sID09PSBcInJheXMyNFwiID8gQXJyYXkuZnJvbSggeyBsZW5ndGg6IDEyIH0sICggXywgaSApID0+IGkgKiAxNSApIDogc3ltYm9sID09PSBcImNyb3NzXCIgPyBbIDAsIDkwIF0gOiBbXTtcblx0cmV0dXJuIGthdHkubWFwKCAoIGsgKSA9PiB7XG5cdFx0Y29uc3QgYSA9ICggayAqIE1hdGguUEkgKSAvIDE4MDtcblx0XHRjb25zdCB4ID0gciAqIE1hdGguY29zKCBhICksIHkgPSByICogTWF0aC5zaW4oIGEgKTtcblx0XHRyZXR1cm4gWyAteCwgLXksIHgsIHkgXSBhcyBjb25zdDtcblx0fSApO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9CQUFvQjtBQUNwQiwyQ0FBMkM7QUFDM0MsNkJBQTZCO0FBQzdCLCtDQUErQztBQUMvQyxpREFBaUQ7QUFLakQsOEVBQThFLEdBRTlFLHFDQUFxQyxHQUNyQyxPQUFPLE1BQU0sU0FBeUQ7RUFDckUsUUFBUTtJQUFFO0lBQUc7R0FBRztFQUNoQixRQUFRO0lBQUU7SUFBRztHQUFHO0VBQ2hCLE9BQU8sRUFBRTtBQUNWLEVBQUU7QUFFRix5REFBeUQsR0FDekQsT0FBTyxNQUFNLE9BQU87RUFBRTtFQUFJO0NBQUcsQ0FBVTtBQUV2Qzs7O0NBR0MsR0FDRCxPQUFPLFNBQVMsZUFBZ0IsTUFBbUIsRUFBRSxRQUFnQjtFQUNwRSxNQUFNLElBQUksV0FBVztFQUNyQixNQUFNLE9BQU8sV0FBVyxXQUFXLE1BQU0sSUFBSSxDQUFFO0lBQUUsUUFBUTtFQUFHLEdBQUcsQ0FBRSxHQUFHLElBQU8sSUFBSSxNQUFPLFdBQVcsVUFBVTtJQUFFO0lBQUc7R0FBSSxHQUFHLEVBQUU7RUFDekgsT0FBTyxLQUFLLEdBQUcsQ0FBRSxDQUFFO0lBQ2xCLE1BQU0sSUFBSSxBQUFFLElBQUksS0FBSyxFQUFFLEdBQUs7SUFDNUIsTUFBTSxJQUFJLElBQUksS0FBSyxHQUFHLENBQUUsSUFBSyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUU7SUFDL0MsT0FBTztNQUFFLENBQUM7TUFBRyxDQUFDO01BQUc7TUFBRztLQUFHO0VBQ3hCO0FBQ0QifQ==