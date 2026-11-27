// @project-metadata
// Path: site/screen/loci/interpreter/fn.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
/** Atrybuty fn → model. */ export function fnModel(p) {
  if (p.x !== undefined) return {
    id: p.id,
    param: p.param,
    wzor: [
      "xy",
      p.x,
      p.y
    ]
  };
  const [jednostka, kat] = p.deg !== undefined ? [
    "deg",
    p.deg
  ] : p.rad !== undefined ? [
    "rad",
    p.rad
  ] : [
    "turn",
    p.turn
  ];
  return {
    id: p.id,
    param: p.param,
    wzor: [
      "polar",
      p.r,
      kat,
      jednostka
    ]
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyZWVuL2xvY2kvaW50ZXJwcmV0ZXIvZm4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyZWVuL2xvY2kvaW50ZXJwcmV0ZXIvZm4udHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IExPQ0lGblByb3BzIH0gZnJvbSBcIkAvc2l0ZS9jb21tb24vbGFuZy9sb2NpL2VsZW1lbnQvZGVmL0xPQ0lGbkVsZW1lbnQudHNcIjtcbmltcG9ydCB0eXBlIHsgSmVkbm9zdGthS2F0YSB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvbG9jaS9zaGFyZWQvdHlwZXMudHNcIjtcblxuLyoqIGZuIHcgbW9kZWx1OiB3esOzciBqYWtvIGtyb3RrYS4gV3lyYcW8ZW5pYSBuaWUgc8SFIGplc3pjemUgbGljem9uZSDigJQgem9zdGFqxIUgdGVrc3RlbS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTW9kZWxGbiB7XG5cdGlkOiBzdHJpbmc7XG5cdHBhcmFtOiBzdHJpbmc7XG5cdHd6b3I6IHJlYWRvbmx5IFsgcG9zdGFjOiBcInh5XCIsIHg6IHN0cmluZywgeTogc3RyaW5nIF0gfCByZWFkb25seSBbIHBvc3RhYzogXCJwb2xhclwiLCByOiBzdHJpbmcsIGthdDogc3RyaW5nLCBqZWRub3N0a2E6IEplZG5vc3RrYUthdGEgXTtcbn1cblxuLyoqIEF0cnlidXR5IGZuIOKGkiBtb2RlbC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbk1vZGVsKCBwOiBMT0NJRm5Qcm9wcyApOiBNb2RlbEZuIHtcblx0aWYgKCBwLnggIT09IHVuZGVmaW5lZCApIHJldHVybiB7IGlkOiBwLmlkLCBwYXJhbTogcC5wYXJhbSwgd3pvcjogWyBcInh5XCIsIHAueCwgcC55IF0gfTtcblx0Y29uc3QgWyBqZWRub3N0a2EsIGthdCBdID0gcC5kZWcgIT09IHVuZGVmaW5lZCA/IFsgXCJkZWdcIiwgcC5kZWcgXSBhcyBjb25zdCA6IHAucmFkICE9PSB1bmRlZmluZWQgPyBbIFwicmFkXCIsIHAucmFkIF0gYXMgY29uc3QgOiBbIFwidHVyblwiLCBwLnR1cm4gXSBhcyBjb25zdDtcblx0cmV0dXJuIHsgaWQ6IHAuaWQsIHBhcmFtOiBwLnBhcmFtLCB3em9yOiBbIFwicG9sYXJcIiwgcC5yLCBrYXQsIGplZG5vc3RrYSBdIH07XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLDJDQUEyQztBQUMzQyw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDtBQVlqRCx5QkFBeUIsR0FDekIsT0FBTyxTQUFTLFFBQVMsQ0FBYztFQUN0QyxJQUFLLEVBQUUsQ0FBQyxLQUFLLFdBQVksT0FBTztJQUFFLElBQUksRUFBRSxFQUFFO0lBQUUsT0FBTyxFQUFFLEtBQUs7SUFBRSxNQUFNO01BQUU7TUFBTSxFQUFFLENBQUM7TUFBRSxFQUFFLENBQUM7S0FBRTtFQUFDO0VBQ3JGLE1BQU0sQ0FBRSxXQUFXLElBQUssR0FBRyxFQUFFLEdBQUcsS0FBSyxZQUFZO0lBQUU7SUFBTyxFQUFFLEdBQUc7R0FBRSxHQUFZLEVBQUUsR0FBRyxLQUFLLFlBQVk7SUFBRTtJQUFPLEVBQUUsR0FBRztHQUFFLEdBQVk7SUFBRTtJQUFRLEVBQUUsSUFBSTtHQUFFO0VBQ2pKLE9BQU87SUFBRSxJQUFJLEVBQUUsRUFBRTtJQUFFLE9BQU8sRUFBRSxLQUFLO0lBQUUsTUFBTTtNQUFFO01BQVMsRUFBRSxDQUFDO01BQUU7TUFBSztLQUFXO0VBQUM7QUFDM0UifQ==