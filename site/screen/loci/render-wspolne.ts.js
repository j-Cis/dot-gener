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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXdzcG9sbmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXdzcG9sbmUudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IExpbmVTdHlsZSB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvbG9jaS9hdHRyaWJ1dGUvTE9DSUF4aXNBdHRyaWJ1dGVzLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFBvaW50U3ltYm9sIH0gZnJvbSBcIkAvc2l0ZS9jb21tb24vbGFuZy9sb2NpL2F0dHJpYnV0ZS9MT0NJUG9pbnRBdHRyaWJ1dGVzLnRzXCI7XG5cbi8qKiBXc3DDs2xuZSBkbGEgcnlzb3dhbmlhIExPQ0kgdyBTVkcgaSBuYSBDYW52YXM6IHd5bWlhcnkgdyBwaWtzZWxhY2ggZWtyYW51LiAqL1xuXG4vKiogS3Jlc2tpIHN0eWzDs3cgbGluaWkgdyBweCBla3JhbnUuICovXG5leHBvcnQgY29uc3QgS1JFU0tJOiBSZWFkb25seTxSZWNvcmQ8TGluZVN0eWxlLCByZWFkb25seSBudW1iZXJbXT4+ID0ge1xuXHRkYXNoZWQ6IFsgNiwgNCBdLFxuXHRkb3R0ZWQ6IFsgMSwgMyBdLFxuXHRzb2xpZDogW10sXG59O1xuXG4vKiogR3JvdCB3IHB4IGVrcmFudSBwcnp5IHNrYWxpIDE6IFtkxYJ1Z2/Fm8SHLCBzemVyb2tvxZvEh10uICovXG5leHBvcnQgY29uc3QgR1JPVCA9IFsgMTAsIDcgXSBhcyBjb25zdDtcblxuLyoqXG4gKiBPZGNpbmtpIHN5bWJvbHUgcHVua3R1IChweCBla3JhbnUsIMWbcm9kZWsgdyAwLDApIGRsYSBcInJheXMyNFwiIGkgXCJjcm9zc1wiO1xuICogXCJjaXJjbGVcIiBpIFwiZG90XCIgcnlzdWplIHNpxJkgb2tyxJlnaWVtIG8gcHJvbWllbml1IHdpZWxrb8WbxIcvMiAoa3JvcGthOiB3eXBlxYJuaW9ueSwgd2llbGtvxZvEhy80KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9kY2lua2lTeW1ib2x1KCBzeW1ib2w6IFBvaW50U3ltYm9sLCB3aWVsa29zYzogbnVtYmVyICk6IHJlYWRvbmx5IChyZWFkb25seSBbIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciBdKVtdIHtcblx0Y29uc3QgciA9IHdpZWxrb3NjIC8gMjtcblx0Y29uc3Qga2F0eSA9IHN5bWJvbCA9PT0gXCJyYXlzMjRcIiA/IEFycmF5LmZyb20oIHsgbGVuZ3RoOiAxMiB9LCAoIF8sIGkgKSA9PiBpICogMTUgKSA6IHN5bWJvbCA9PT0gXCJjcm9zc1wiID8gWyAwLCA5MCBdIDogW107XG5cdHJldHVybiBrYXR5Lm1hcCggKCBrICkgPT4ge1xuXHRcdGNvbnN0IGEgPSAoIGsgKiBNYXRoLlBJICkgLyAxODA7XG5cdFx0Y29uc3QgeCA9IHIgKiBNYXRoLmNvcyggYSApLCB5ID0gciAqIE1hdGguc2luKCBhICk7XG5cdFx0cmV0dXJuIFsgLXgsIC15LCB4LCB5IF0gYXMgY29uc3Q7XG5cdH0gKTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsMkNBQTJDO0FBQzNDLDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFDL0MsaURBQWlEO0FBS2pELDhFQUE4RSxHQUU5RSxxQ0FBcUMsR0FDckMsT0FBTyxNQUFNLFNBQXlEO0VBQ3JFLFFBQVE7SUFBRTtJQUFHO0dBQUc7RUFDaEIsUUFBUTtJQUFFO0lBQUc7R0FBRztFQUNoQixPQUFPLEVBQUU7QUFDVixFQUFFO0FBRUYseURBQXlELEdBQ3pELE9BQU8sTUFBTSxPQUFPO0VBQUU7RUFBSTtDQUFHLENBQVU7QUFFdkM7OztDQUdDLEdBQ0QsT0FBTyxTQUFTLGVBQWdCLE1BQW1CLEVBQUUsUUFBZ0I7RUFDcEUsTUFBTSxJQUFJLFdBQVc7RUFDckIsTUFBTSxPQUFPLFdBQVcsV0FBVyxNQUFNLElBQUksQ0FBRTtJQUFFLFFBQVE7RUFBRyxHQUFHLENBQUUsR0FBRyxJQUFPLElBQUksTUFBTyxXQUFXLFVBQVU7SUFBRTtJQUFHO0dBQUksR0FBRyxFQUFFO0VBQ3pILE9BQU8sS0FBSyxHQUFHLENBQUUsQ0FBRTtJQUNsQixNQUFNLElBQUksQUFBRSxJQUFJLEtBQUssRUFBRSxHQUFLO0lBQzVCLE1BQU0sSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFFLElBQUssSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFFO0lBQy9DLE9BQU87TUFBRSxDQUFDO01BQUcsQ0FBQztNQUFHO01BQUc7S0FBRztFQUN4QjtBQUNEIn0=