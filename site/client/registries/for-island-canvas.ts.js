// @project-metadata
// Path: site/client/registries/for-island-canvas.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { drawDotxCanvas } from "@/site/common/lang/dotx/render-canvas.ts";
/**
 * Rysunki <canvas> uruchamiane w przeglądarce przez VectorViewport:
 * <VectorViewport renderer="Canvas" sourceFormat="CANVAS" source={RYSUNKI.nazwa} scene={[w, h]} />.
 * Serwer odnajduje funkcję w tym rejestrze i przekazuje przeglądarce jej klucz.
 *
 * Wszystko, co tu jest, trafia do przeglądarki razem z VectorViewport.
 */ export const RYSUNKI = {
  dotx: drawDotxCanvas,
  test: ({ ctx, dane })=>{
    const label = typeof dane === "string" ? dane : "VectorViewport działa";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY2xpZW50L3JlZ2lzdHJpZXMvZm9yLWlzbGFuZC1jYW52YXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvY2xpZW50L3JlZ2lzdHJpZXMvZm9yLWlzbGFuZC1jYW52YXMudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IENhbnZhc0RyYXdlciB9IGZyb20gXCJAL3NpdGUvY2xpZW50L1ZlY3RvclZpZXdwb3J0LmlzbGFuZC50c3hcIjtcbmltcG9ydCB7IGRyYXdEb3R4Q2FudmFzIH0gZnJvbSBcIkAvc2l0ZS9jb21tb24vbGFuZy9kb3R4L3JlbmRlci1jYW52YXMudHNcIjtcbi8qKlxuICogUnlzdW5raSA8Y2FudmFzPiB1cnVjaGFtaWFuZSB3IHByemVnbMSFZGFyY2UgcHJ6ZXogVmVjdG9yVmlld3BvcnQ6XG4gKiA8VmVjdG9yVmlld3BvcnQgcmVuZGVyZXI9XCJDYW52YXNcIiBzb3VyY2VGb3JtYXQ9XCJDQU5WQVNcIiBzb3VyY2U9e1JZU1VOS0kubmF6d2F9IHNjZW5lPXtbdywgaF19IC8+LlxuICogU2Vyd2VyIG9kbmFqZHVqZSBmdW5rY2rEmSB3IHR5bSByZWplc3RyemUgaSBwcnpla2F6dWplIHByemVnbMSFZGFyY2UgamVqIGtsdWN6LlxuICpcbiAqIFdzenlzdGtvLCBjbyB0dSBqZXN0LCB0cmFmaWEgZG8gcHJ6ZWdsxIVkYXJraSByYXplbSB6IFZlY3RvclZpZXdwb3J0LlxuICovXG5leHBvcnQgY29uc3QgUllTVU5LSSA9IHtcblx0ZG90eDogZHJhd0RvdHhDYW52YXMsXG5cdHRlc3Q6ICggeyBjdHgsIGRhbmUgfSApID0+IHtcblx0XHRjb25zdCBsYWJlbCA9IHR5cGVvZiBkYW5lID09PSBcInN0cmluZ1wiID8gZGFuZSA6IFwiVmVjdG9yVmlld3BvcnQgZHppYcWCYVwiO1xuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IFwiI2Y4ZjlmYVwiO1xuXHRcdGN0eC5maWxsUmVjdCggMCwgMCwgNDAwLCAyNDAgKTtcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSBcIiMzMzNcIjtcblx0XHRjdHgubGluZVdpZHRoID0gMjtcblx0XHRjdHguc3Ryb2tlUmVjdCggMSwgMSwgMzk4LCAyMzggKTtcblxuXHRcdGN0eC5zdHJva2VTdHlsZSA9IFwiI2UwZTBlMFwiO1xuXHRcdGN0eC5saW5lV2lkdGggPSAxO1xuXHRcdGZvciAoIGxldCB4ID0gNDA7IHggPCA0MDA7IHggKz0gNDAgKSB7XG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRjdHgubW92ZVRvKCB4LCAwICk7XG5cdFx0XHRjdHgubGluZVRvKCB4LCAyNDAgKTtcblx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHR9XG5cdFx0Zm9yICggbGV0IHkgPSA0MDsgeSA8IDI0MDsgeSArPSA0MCApIHtcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5tb3ZlVG8oIDAsIHkgKTtcblx0XHRcdGN0eC5saW5lVG8oIDQwMCwgeSApO1xuXHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdH1cblxuXHRcdGN0eC5maWxsU3R5bGUgPSBcIiMyNTYzZWJcIjtcblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0Y3R4LmFyYyggMjAwLCAxMjAsIDQ4LCAwLCBNYXRoLlBJICogMiApO1xuXHRcdGN0eC5maWxsKCk7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gXCIjZmZmZmZmXCI7XG5cdFx0Y3R4LmZvbnQgPSBcImJvbGQgMTZweCBBcmlhbCwgc2Fucy1zZXJpZlwiO1xuXHRcdGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuXHRcdGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuXHRcdGN0eC5maWxsVGV4dCggbGFiZWwsIDIwMCwgMTIwICk7XG5cdH0sXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCBDYW52YXNEcmF3ZXI+O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9CQUFvQjtBQUNwQixvREFBb0Q7QUFDcEQsNkJBQTZCO0FBQzdCLCtDQUErQztBQUMvQyxpREFBaUQ7QUFHakQsU0FBUyxjQUFjLFFBQVEsMkNBQTJDO0FBQzFFOzs7Ozs7Q0FNQyxHQUNELE9BQU8sTUFBTSxVQUFVO0VBQ3RCLE1BQU07RUFDTixNQUFNLENBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO0lBQ3BCLE1BQU0sUUFBUSxPQUFPLFNBQVMsV0FBVyxPQUFPO0lBRWhELElBQUksU0FBUyxHQUFHO0lBQ2hCLElBQUksUUFBUSxDQUFFLEdBQUcsR0FBRyxLQUFLO0lBQ3pCLElBQUksV0FBVyxHQUFHO0lBQ2xCLElBQUksU0FBUyxHQUFHO0lBQ2hCLElBQUksVUFBVSxDQUFFLEdBQUcsR0FBRyxLQUFLO0lBRTNCLElBQUksV0FBVyxHQUFHO0lBQ2xCLElBQUksU0FBUyxHQUFHO0lBQ2hCLElBQU0sSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLEtBQUssR0FBSztNQUNwQyxJQUFJLFNBQVM7TUFDYixJQUFJLE1BQU0sQ0FBRSxHQUFHO01BQ2YsSUFBSSxNQUFNLENBQUUsR0FBRztNQUNmLElBQUksTUFBTTtJQUNYO0lBQ0EsSUFBTSxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxHQUFLO01BQ3BDLElBQUksU0FBUztNQUNiLElBQUksTUFBTSxDQUFFLEdBQUc7TUFDZixJQUFJLE1BQU0sQ0FBRSxLQUFLO01BQ2pCLElBQUksTUFBTTtJQUNYO0lBRUEsSUFBSSxTQUFTLEdBQUc7SUFDaEIsSUFBSSxTQUFTO0lBQ2IsSUFBSSxHQUFHLENBQUUsS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLEVBQUUsR0FBRztJQUNwQyxJQUFJLElBQUk7SUFFUixJQUFJLFNBQVMsR0FBRztJQUNoQixJQUFJLElBQUksR0FBRztJQUNYLElBQUksU0FBUyxHQUFHO0lBQ2hCLElBQUksWUFBWSxHQUFHO0lBQ25CLElBQUksUUFBUSxDQUFFLE9BQU8sS0FBSztFQUMzQjtBQUNELEVBQXlDIn0=