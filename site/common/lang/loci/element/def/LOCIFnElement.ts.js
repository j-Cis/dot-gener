// @project-metadata
// Path: site/common/lang/loci/element/def/LOCIFnElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
/**
 * fn — funkcja wyznaczająca współrzędne w zależności od parametru:
 *   kartezjańsko: fn id="spiral" param="t" x="t*cos(2*pi*t)" y="t*sin(2*pi*t)"
 *   biegunowo:    fn id="arc" param="k" r="5" turn="k/6"   (kąt: deg albo rad albo turn)
 * Używana przez nazwę, np. p … fn="spiral" at="1/3".
 */ /** Jednostka kąta we wzorze biegunowym. */ /** Atrybuty fn → element. */ export function fnElement(p) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY29tbW9uL2xhbmcvbG9jaS9lbGVtZW50L2RlZi9MT0NJRm5FbGVtZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEBwcm9qZWN0LW1ldGFkYXRhXG4vLyBQYXRoOiBzaXRlL2NvbW1vbi9sYW5nL2xvY2kvZWxlbWVudC9kZWYvTE9DSUZuRWxlbWVudC50c1xuLy8gQXV0aG9yOiBKYW4gUm9tYW4gQ2lzb3dza2lcbi8vIE9SQ0lEOiBodHRwczovL29yY2lkLm9yZy8wMDA5LTAwMDktMjkwNy0zNzkyXG4vLyBSZXBvc2l0b3J5OiBodHRwczovL2dpdGh1Yi5jb20vai1DaXMvZG90LWdlbmVyXG5cbi8qKlxuICogZm4g4oCUIGZ1bmtjamEgd3l6bmFjemFqxIVjYSB3c3DDs8WCcnrEmWRuZSB3IHphbGXFvG5vxZtjaSBvZCBwYXJhbWV0cnU6XG4gKiAgIGthcnRlemphxYRza286IGZuIGlkPVwic3BpcmFsXCIgcGFyYW09XCJ0XCIgeD1cInQqY29zKDIqcGkqdClcIiB5PVwidCpzaW4oMipwaSp0KVwiXG4gKiAgIGJpZWd1bm93bzogICAgZm4gaWQ9XCJhcmNcIiBwYXJhbT1cImtcIiByPVwiNVwiIHR1cm49XCJrLzZcIiAgIChrxIV0OiBkZWcgYWxibyByYWQgYWxibyB0dXJuKVxuICogVcW8eXdhbmEgcHJ6ZXogbmF6d8SZLCBucC4gcCDigKYgZm49XCJzcGlyYWxcIiBhdD1cIjEvM1wiLlxuICovXG5cbi8qKiBKZWRub3N0a2Ega8SFdGEgd2Ugd3pvcnplIGJpZWd1bm93eW0uICovXG5leHBvcnQgdHlwZSBKZWRub3N0a2FLYXRhID0gXCJkZWdcIiB8IFwicmFkXCIgfCBcInR1cm5cIjtcblxuLyoqIEvEhXQgYmllZ3Vub3d5OiBkb2vFgmFkbmllIGplZGVuIHogZGVnIC8gcmFkIC8gdHVybi4gKi9cbnR5cGUgS2F0Rm4gPVxuXHR8IHsgZGVnOiBzdHJpbmc7IHJhZD86IG5ldmVyOyB0dXJuPzogbmV2ZXIgfVxuXHR8IHsgcmFkOiBzdHJpbmc7IGRlZz86IG5ldmVyOyB0dXJuPzogbmV2ZXIgfVxuXHR8IHsgdHVybjogc3RyaW5nOyBkZWc/OiBuZXZlcjsgcmFkPzogbmV2ZXIgfTtcblxuLyoqIFd6w7NyOiBhbGJvIHggaSB5LCBhbGJvIHIgaSBrxIV0IOKAlCBuaWUgb2JhLiAqL1xudHlwZSBXem9yRm4gPVxuXHR8IHsgeDogc3RyaW5nOyB5OiBzdHJpbmc7IHI/OiBuZXZlcjsgZGVnPzogbmV2ZXI7IHJhZD86IG5ldmVyOyB0dXJuPzogbmV2ZXIgfVxuXHR8ICh7IHI6IHN0cmluZzsgeD86IG5ldmVyOyB5PzogbmV2ZXIgfSAmIEthdEZuKTtcblxuZXhwb3J0IHR5cGUgTE9DSUZuUHJvcHMgPSB7XG5cdC8qKiBuYXp3YSBmdW5rY2ppICovXG5cdGlkOiBzdHJpbmc7XG5cdC8qKiBuYXp3YSBwYXJhbWV0cnUgdcW8eXdhbmEgd2Ugd3pvcmFjaCwgbnAuIFwidFwiICovXG5cdHBhcmFtOiBzdHJpbmc7XG59ICYgV3pvckZuO1xuXG4vKiogRnVua2NqYSBwbyB3Y3p5dGFuaXU6IHd6w7NyIGpha28ga3JvdGthLiBXeXJhxbxlbmlhIG5pZSBzxIUgamVzemN6ZSBsaWN6b25lIOKAlCB6b3N0YWrEhSB0ZWtzdGVtLiAqL1xuZXhwb3J0IGludGVyZmFjZSBMT0NJRm5FbGVtZW50IHtcblx0aWQ6IHN0cmluZztcblx0cGFyYW06IHN0cmluZztcblx0d3pvcjogcmVhZG9ubHkgWyBwb3N0YWM6IFwieHlcIiwgeDogc3RyaW5nLCB5OiBzdHJpbmcgXSB8IHJlYWRvbmx5IFsgcG9zdGFjOiBcInBvbGFyXCIsIHI6IHN0cmluZywga2F0OiBzdHJpbmcsIGplZG5vc3RrYTogSmVkbm9zdGthS2F0YSBdO1xufVxuXG4vKiogQXRyeWJ1dHkgZm4g4oaSIGVsZW1lbnQuICovXG5leHBvcnQgZnVuY3Rpb24gZm5FbGVtZW50KCBwOiBMT0NJRm5Qcm9wcyApOiBMT0NJRm5FbGVtZW50IHtcblx0aWYgKCBwLnggIT09IHVuZGVmaW5lZCApIHJldHVybiB7IGlkOiBwLmlkLCBwYXJhbTogcC5wYXJhbSwgd3pvcjogWyBcInh5XCIsIHAueCwgcC55IF0gfTtcblx0Y29uc3QgWyBqZWRub3N0a2EsIGthdCBdID0gcC5kZWcgIT09IHVuZGVmaW5lZCA/IFsgXCJkZWdcIiwgcC5kZWcgXSBhcyBjb25zdCA6IHAucmFkICE9PSB1bmRlZmluZWQgPyBbIFwicmFkXCIsIHAucmFkIF0gYXMgY29uc3QgOiBbIFwidHVyblwiLCBwLnR1cm4gXSBhcyBjb25zdDtcblx0cmV0dXJuIHsgaWQ6IHAuaWQsIHBhcmFtOiBwLnBhcmFtLCB3em9yOiBbIFwicG9sYXJcIiwgcC5yLCBrYXQsIGplZG5vc3RrYSBdIH07XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLDJEQUEyRDtBQUMzRCw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDtBQUVqRDs7Ozs7Q0FLQyxHQUVELHlDQUF5QyxHQTRCekMsMkJBQTJCLEdBQzNCLE9BQU8sU0FBUyxVQUFXLENBQWM7RUFDeEMsSUFBSyxFQUFFLENBQUMsS0FBSyxXQUFZLE9BQU87SUFBRSxJQUFJLEVBQUUsRUFBRTtJQUFFLE9BQU8sRUFBRSxLQUFLO0lBQUUsTUFBTTtNQUFFO01BQU0sRUFBRSxDQUFDO01BQUUsRUFBRSxDQUFDO0tBQUU7RUFBQztFQUNyRixNQUFNLENBQUUsV0FBVyxJQUFLLEdBQUcsRUFBRSxHQUFHLEtBQUssWUFBWTtJQUFFO0lBQU8sRUFBRSxHQUFHO0dBQUUsR0FBWSxFQUFFLEdBQUcsS0FBSyxZQUFZO0lBQUU7SUFBTyxFQUFFLEdBQUc7R0FBRSxHQUFZO0lBQUU7SUFBUSxFQUFFLElBQUk7R0FBRTtFQUNqSixPQUFPO0lBQUUsSUFBSSxFQUFFLEVBQUU7SUFBRSxPQUFPLEVBQUUsS0FBSztJQUFFLE1BQU07TUFBRTtNQUFTLEVBQUUsQ0FBQztNQUFFO01BQUs7S0FBVztFQUFDO0FBQzNFIn0=