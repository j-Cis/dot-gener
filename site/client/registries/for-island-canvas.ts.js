// @project-metadata
// Path: site/client/registries/for-island-canvas.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { dotxCanvas } from "@/site/screen/Dotx.render.tsx";
/**
 * Rysunki <canvas> uruchamiane w przeglądarce przez VectorViewport:
 * <VectorViewport renderer="Canvas" sourceFormat="CANVAS" source={RYSUNKI.nazwa} scene={[w, h]} />.
 * Serwer odnajduje funkcję w tym rejestrze i przekazuje przeglądarce jej klucz.
 *
 * Wszystko, co tu jest, trafia do przeglądarki razem z VectorViewport.
 */ export const RYSUNKI = {
  dotx: dotxCanvas,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY2xpZW50L3JlZ2lzdHJpZXMvZm9yLWlzbGFuZC1jYW52YXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvY2xpZW50L3JlZ2lzdHJpZXMvZm9yLWlzbGFuZC1jYW52YXMudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IENhbnZhc0RyYXdlciB9IGZyb20gXCJAL3NpdGUvc2NyZWVuL2NhbnZhcy9kcmF3LWNvbnRleHQudHNcIjtcbmltcG9ydCB7IGRvdHhDYW52YXMgfSBmcm9tIFwiQC9zaXRlL3NjcmVlbi9Eb3R4LnJlbmRlci50c3hcIjtcbi8qKlxuICogUnlzdW5raSA8Y2FudmFzPiB1cnVjaGFtaWFuZSB3IHByemVnbMSFZGFyY2UgcHJ6ZXogVmVjdG9yVmlld3BvcnQ6XG4gKiA8VmVjdG9yVmlld3BvcnQgcmVuZGVyZXI9XCJDYW52YXNcIiBzb3VyY2VGb3JtYXQ9XCJDQU5WQVNcIiBzb3VyY2U9e1JZU1VOS0kubmF6d2F9IHNjZW5lPXtbdywgaF19IC8+LlxuICogU2Vyd2VyIG9kbmFqZHVqZSBmdW5rY2rEmSB3IHR5bSByZWplc3RyemUgaSBwcnpla2F6dWplIHByemVnbMSFZGFyY2UgamVqIGtsdWN6LlxuICpcbiAqIFdzenlzdGtvLCBjbyB0dSBqZXN0LCB0cmFmaWEgZG8gcHJ6ZWdsxIVkYXJraSByYXplbSB6IFZlY3RvclZpZXdwb3J0LlxuICovXG5leHBvcnQgY29uc3QgUllTVU5LSSA9IHtcblx0ZG90eDogZG90eENhbnZhcyxcblx0dGVzdDogKCB7IGN0eCwgZGFuZSB9ICkgPT4ge1xuXHRcdGNvbnN0IGxhYmVsID0gdHlwZW9mIGRhbmUgPT09IFwic3RyaW5nXCIgPyBkYW5lIDogXCJWZWN0b3JWaWV3cG9ydCBkemlhxYJhXCI7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gXCIjZjhmOWZhXCI7XG5cdFx0Y3R4LmZpbGxSZWN0KCAwLCAwLCA0MDAsIDI0MCApO1xuXHRcdGN0eC5zdHJva2VTdHlsZSA9IFwiIzMzM1wiO1xuXHRcdGN0eC5saW5lV2lkdGggPSAyO1xuXHRcdGN0eC5zdHJva2VSZWN0KCAxLCAxLCAzOTgsIDIzOCApO1xuXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gXCIjZTBlMGUwXCI7XG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDE7XG5cdFx0Zm9yICggbGV0IHggPSA0MDsgeCA8IDQwMDsgeCArPSA0MCApIHtcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5tb3ZlVG8oIHgsIDAgKTtcblx0XHRcdGN0eC5saW5lVG8oIHgsIDI0MCApO1xuXHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdH1cblx0XHRmb3IgKCBsZXQgeSA9IDQwOyB5IDwgMjQwOyB5ICs9IDQwICkge1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y3R4Lm1vdmVUbyggMCwgeSApO1xuXHRcdFx0Y3R4LmxpbmVUbyggNDAwLCB5ICk7XG5cdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0fVxuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IFwiIzI1NjNlYlwiO1xuXHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRjdHguYXJjKCAyMDAsIDEyMCwgNDgsIDAsIE1hdGguUEkgKiAyICk7XG5cdFx0Y3R4LmZpbGwoKTtcblxuXHRcdGN0eC5maWxsU3R5bGUgPSBcIiNmZmZmZmZcIjtcblx0XHRjdHguZm9udCA9IFwiYm9sZCAxNnB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XG5cdFx0Y3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG5cdFx0Y3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG5cdFx0Y3R4LmZpbGxUZXh0KCBsYWJlbCwgMjAwLCAxMjAgKTtcblx0fSxcbn0gc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIENhbnZhc0RyYXdlcj47XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLG9EQUFvRDtBQUNwRCw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDtBQUdqRCxTQUFTLFVBQVUsUUFBUSxnQ0FBZ0M7QUFDM0Q7Ozs7OztDQU1DLEdBQ0QsT0FBTyxNQUFNLFVBQVU7RUFDdEIsTUFBTTtFQUNOLE1BQU0sQ0FBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7SUFDcEIsTUFBTSxRQUFRLE9BQU8sU0FBUyxXQUFXLE9BQU87SUFFaEQsSUFBSSxTQUFTLEdBQUc7SUFDaEIsSUFBSSxRQUFRLENBQUUsR0FBRyxHQUFHLEtBQUs7SUFDekIsSUFBSSxXQUFXLEdBQUc7SUFDbEIsSUFBSSxTQUFTLEdBQUc7SUFDaEIsSUFBSSxVQUFVLENBQUUsR0FBRyxHQUFHLEtBQUs7SUFFM0IsSUFBSSxXQUFXLEdBQUc7SUFDbEIsSUFBSSxTQUFTLEdBQUc7SUFDaEIsSUFBTSxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxHQUFLO01BQ3BDLElBQUksU0FBUztNQUNiLElBQUksTUFBTSxDQUFFLEdBQUc7TUFDZixJQUFJLE1BQU0sQ0FBRSxHQUFHO01BQ2YsSUFBSSxNQUFNO0lBQ1g7SUFDQSxJQUFNLElBQUksSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLEdBQUs7TUFDcEMsSUFBSSxTQUFTO01BQ2IsSUFBSSxNQUFNLENBQUUsR0FBRztNQUNmLElBQUksTUFBTSxDQUFFLEtBQUs7TUFDakIsSUFBSSxNQUFNO0lBQ1g7SUFFQSxJQUFJLFNBQVMsR0FBRztJQUNoQixJQUFJLFNBQVM7SUFDYixJQUFJLEdBQUcsQ0FBRSxLQUFLLEtBQUssSUFBSSxHQUFHLEtBQUssRUFBRSxHQUFHO0lBQ3BDLElBQUksSUFBSTtJQUVSLElBQUksU0FBUyxHQUFHO0lBQ2hCLElBQUksSUFBSSxHQUFHO0lBQ1gsSUFBSSxTQUFTLEdBQUc7SUFDaEIsSUFBSSxZQUFZLEdBQUc7SUFDbkIsSUFBSSxRQUFRLENBQUUsT0FBTyxLQUFLO0VBQzNCO0FBQ0QsRUFBeUMifQ==