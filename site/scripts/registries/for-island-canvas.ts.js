// @project-metadata
// Path: site/scripts/registries/for-island-canvas.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { drawDotxCanvas } from "../lang/dotx/render-canvas.ts";
/**
 * Rysunki <canvas> uruchamiane w przeglądarce przez Canvas, wybierane przez
 * props: <Canvas rysunek="nazwa" ... />.
 *
 * Wszystko, co tu jest, trafia do przeglądarki razem z Canvas.
 */ export const RYSUNKI = {
  "dotx": drawDotxCanvas,
  "test": ({ ctx, dane })=>{
    const label = typeof dane === "string" ? dane : "Canvas działa";
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, 400, 240);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 398, 238);
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    for(let x = 40; x < 400; x += 40){
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 240);
      ctx.stroke();
    }
    for(let y = 40; y < 240; y += 40){
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(400, y);
      ctx.stroke();
    }
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(200, 120, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 200, 120);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyaXB0cy9yZWdpc3RyaWVzL2Zvci1pc2xhbmQtY2FudmFzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEBwcm9qZWN0LW1ldGFkYXRhXG4vLyBQYXRoOiBzaXRlL3NjcmlwdHMvcmVnaXN0cmllcy9mb3ItaXNsYW5kLWNhbnZhcy50c1xuLy8gQXV0aG9yOiBKYW4gUm9tYW4gQ2lzb3dza2lcbi8vIE9SQ0lEOiBodHRwczovL29yY2lkLm9yZy8wMDA5LTAwMDktMjkwNy0zNzkyXG4vLyBSZXBvc2l0b3J5OiBodHRwczovL2dpdGh1Yi5jb20vai1DaXMvZG90LWdlbmVyXG5cbmltcG9ydCB0eXBlIHsgQ2FudmFzRHJhd2VyIH0gZnJvbSBcIkAvc2l0ZS9mZWF0dXJlcy91aS9DYW52YXMuaXNsYW5kLnRzeFwiO1xuaW1wb3J0IHsgZHJhd0RvdHhDYW52YXMgfSBmcm9tIFwiLi4vbGFuZy9kb3R4L3JlbmRlci1jYW52YXMudHNcIjtcbi8qKlxuICogUnlzdW5raSA8Y2FudmFzPiB1cnVjaGFtaWFuZSB3IHByemVnbMSFZGFyY2UgcHJ6ZXogQ2FudmFzLCB3eWJpZXJhbmUgcHJ6ZXpcbiAqIHByb3BzOiA8Q2FudmFzIHJ5c3VuZWs9XCJuYXp3YVwiIC4uLiAvPi5cbiAqXG4gKiBXc3p5c3RrbywgY28gdHUgamVzdCwgdHJhZmlhIGRvIHByemVnbMSFZGFya2kgcmF6ZW0geiBDYW52YXMuXG4gKi9cbmV4cG9ydCBjb25zdCBSWVNVTktJOiBSZWNvcmQ8c3RyaW5nLCBDYW52YXNEcmF3ZXI+ID0ge1xuICBcImRvdHhcIjogZHJhd0RvdHhDYW52YXMsXG4gIFwidGVzdFwiOiAoeyBjdHgsIGRhbmUgfSkgPT4ge1xuICAgIGNvbnN0IGxhYmVsID0gdHlwZW9mIGRhbmUgPT09IFwic3RyaW5nXCIgPyBkYW5lIDogXCJDYW52YXMgZHppYcWCYVwiO1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiI2Y4ZjlmYVwiO1xuICAgIGN0eC5maWxsUmVjdCgwLCAwLCA0MDAsIDI0MCk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCIjMzMzXCI7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgY3R4LnN0cm9rZVJlY3QoMSwgMSwgMzk4LCAyMzgpO1xuXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCIjZTBlMGUwXCI7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDE7XG4gICAgZm9yIChsZXQgeCA9IDQwOyB4IDwgNDAwOyB4ICs9IDQwKSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKHgsIDApO1xuICAgICAgY3R4LmxpbmVUbyh4LCAyNDApO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBmb3IgKGxldCB5ID0gNDA7IHkgPCAyNDA7IHkgKz0gNDApIHtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oMCwgeSk7XG4gICAgICBjdHgubGluZVRvKDQwMCwgeSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiIzI1NjNlYlwiO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguYXJjKDIwMCwgMTIwLCA0OCwgMCwgTWF0aC5QSSAqIDIpO1xuICAgIGN0eC5maWxsKCk7XG5cbiAgICBjdHguZmlsbFN0eWxlID0gXCIjZmZmZmZmXCI7XG4gICAgY3R4LmZvbnQgPSBcImJvbGQgMTZweCBBcmlhbCwgc2Fucy1zZXJpZlwiO1xuICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuICAgIGN0eC5maWxsVGV4dChsYWJlbCwgMjAwLCAxMjApO1xuICB9LFxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIscURBQXFEO0FBQ3JELDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFDL0MsaURBQWlEO0FBR2pELFNBQVMsY0FBYyxRQUFRLGdDQUFnQztBQUMvRDs7Ozs7Q0FLQyxHQUNELE9BQU8sTUFBTSxVQUF3QztFQUNuRCxRQUFRO0VBQ1IsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtJQUNwQixNQUFNLFFBQVEsT0FBTyxTQUFTLFdBQVcsT0FBTztJQUVoRCxJQUFJLFNBQVMsR0FBRztJQUNoQixJQUFJLFFBQVEsQ0FBQyxHQUFHLEdBQUcsS0FBSztJQUN4QixJQUFJLFdBQVcsR0FBRztJQUNsQixJQUFJLFNBQVMsR0FBRztJQUNoQixJQUFJLFVBQVUsQ0FBQyxHQUFHLEdBQUcsS0FBSztJQUUxQixJQUFJLFdBQVcsR0FBRztJQUNsQixJQUFJLFNBQVMsR0FBRztJQUNoQixJQUFLLElBQUksSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLEdBQUk7TUFDakMsSUFBSSxTQUFTO01BQ2IsSUFBSSxNQUFNLENBQUMsR0FBRztNQUNkLElBQUksTUFBTSxDQUFDLEdBQUc7TUFDZCxJQUFJLE1BQU07SUFDWjtJQUNBLElBQUssSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLEtBQUssR0FBSTtNQUNqQyxJQUFJLFNBQVM7TUFDYixJQUFJLE1BQU0sQ0FBQyxHQUFHO01BQ2QsSUFBSSxNQUFNLENBQUMsS0FBSztNQUNoQixJQUFJLE1BQU07SUFDWjtJQUVBLElBQUksU0FBUyxHQUFHO0lBQ2hCLElBQUksU0FBUztJQUNiLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxFQUFFLEdBQUc7SUFDbkMsSUFBSSxJQUFJO0lBRVIsSUFBSSxTQUFTLEdBQUc7SUFDaEIsSUFBSSxJQUFJLEdBQUc7SUFDWCxJQUFJLFNBQVMsR0FBRztJQUNoQixJQUFJLFlBQVksR0FBRztJQUNuQixJQUFJLFFBQVEsQ0FBQyxPQUFPLEtBQUs7RUFDM0I7QUFDRixFQUFFIn0=