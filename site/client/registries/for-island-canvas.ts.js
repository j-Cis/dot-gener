// @project-metadata
// Path: site/scripts/registries/for-island-canvas.ts
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
  "dotx": drawDotxCanvas,
  "test": ({ ctx, dane })=>{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY2xpZW50L3JlZ2lzdHJpZXMvZm9yLWlzbGFuZC1jYW52YXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyaXB0cy9yZWdpc3RyaWVzL2Zvci1pc2xhbmQtY2FudmFzLnRzXG4vLyBBdXRob3I6IEphbiBSb21hbiBDaXNvd3NraVxuLy8gT1JDSUQ6IGh0dHBzOi8vb3JjaWQub3JnLzAwMDktMDAwOS0yOTA3LTM3OTJcbi8vIFJlcG9zaXRvcnk6IGh0dHBzOi8vZ2l0aHViLmNvbS9qLUNpcy9kb3QtZ2VuZXJcblxuaW1wb3J0IHR5cGUgeyBDYW52YXNEcmF3ZXIgfSBmcm9tIFwiQC9zaXRlL2NsaWVudC9WZWN0b3JWaWV3cG9ydC5pc2xhbmQudHN4XCI7XG5pbXBvcnQgeyBkcmF3RG90eENhbnZhcyB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvZG90eC9yZW5kZXItY2FudmFzLnRzXCI7XG4vKipcbiAqIFJ5c3Vua2kgPGNhbnZhcz4gdXJ1Y2hhbWlhbmUgdyBwcnplZ2zEhWRhcmNlIHByemV6IFZlY3RvclZpZXdwb3J0OlxuICogPFZlY3RvclZpZXdwb3J0IHJlbmRlcmVyPVwiQ2FudmFzXCIgc291cmNlRm9ybWF0PVwiQ0FOVkFTXCIgc291cmNlPXtSWVNVTktJLm5hendhfSBzY2VuZT17W3csIGhdfSAvPi5cbiAqIFNlcndlciBvZG5hamR1amUgZnVua2NqxJkgdyB0eW0gcmVqZXN0cnplIGkgcHJ6ZWthenVqZSBwcnplZ2zEhWRhcmNlIGplaiBrbHVjei5cbiAqXG4gKiBXc3p5c3RrbywgY28gdHUgamVzdCwgdHJhZmlhIGRvIHByemVnbMSFZGFya2kgcmF6ZW0geiBWZWN0b3JWaWV3cG9ydC5cbiAqL1xuZXhwb3J0IGNvbnN0IFJZU1VOS0kgPSB7XG4gIFwiZG90eFwiOiBkcmF3RG90eENhbnZhcyxcbiAgXCJ0ZXN0XCI6ICh7IGN0eCwgZGFuZSB9KSA9PiB7XG4gICAgY29uc3QgbGFiZWwgPSB0eXBlb2YgZGFuZSA9PT0gXCJzdHJpbmdcIiA/IGRhbmUgOiBcIlZlY3RvclZpZXdwb3J0IGR6aWHFgmFcIjtcblxuICAgIGN0eC5maWxsU3R5bGUgPSBcIiNmOGY5ZmFcIjtcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgNDAwLCAyNDApO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiIzMzM1wiO1xuICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgIGN0eC5zdHJva2VSZWN0KDEsIDEsIDM5OCwgMjM4KTtcblxuICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiI2UwZTBlMFwiO1xuICAgIGN0eC5saW5lV2lkdGggPSAxO1xuICAgIGZvciAobGV0IHggPSA0MDsgeCA8IDQwMDsgeCArPSA0MCkge1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbyh4LCAwKTtcbiAgICAgIGN0eC5saW5lVG8oeCwgMjQwKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgZm9yIChsZXQgeSA9IDQwOyB5IDwgMjQwOyB5ICs9IDQwKSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKDAsIHkpO1xuICAgICAgY3R4LmxpbmVUbyg0MDAsIHkpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5maWxsU3R5bGUgPSBcIiMyNTYzZWJcIjtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmFyYygyMDAsIDEyMCwgNDgsIDAsIE1hdGguUEkgKiAyKTtcbiAgICBjdHguZmlsbCgpO1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiI2ZmZmZmZlwiO1xuICAgIGN0eC5mb250ID0gXCJib2xkIDE2cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcbiAgICBjdHguZmlsbFRleHQobGFiZWwsIDIwMCwgMTIwKTtcbiAgfSxcbn0gc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIENhbnZhc0RyYXdlcj47XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLHFEQUFxRDtBQUNyRCw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDtBQUdqRCxTQUFTLGNBQWMsUUFBUSwyQ0FBMkM7QUFDMUU7Ozs7OztDQU1DLEdBQ0QsT0FBTyxNQUFNLFVBQVU7RUFDckIsUUFBUTtFQUNSLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7SUFDcEIsTUFBTSxRQUFRLE9BQU8sU0FBUyxXQUFXLE9BQU87SUFFaEQsSUFBSSxTQUFTLEdBQUc7SUFDaEIsSUFBSSxRQUFRLENBQUMsR0FBRyxHQUFHLEtBQUs7SUFDeEIsSUFBSSxXQUFXLEdBQUc7SUFDbEIsSUFBSSxTQUFTLEdBQUc7SUFDaEIsSUFBSSxVQUFVLENBQUMsR0FBRyxHQUFHLEtBQUs7SUFFMUIsSUFBSSxXQUFXLEdBQUc7SUFDbEIsSUFBSSxTQUFTLEdBQUc7SUFDaEIsSUFBSyxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxHQUFJO01BQ2pDLElBQUksU0FBUztNQUNiLElBQUksTUFBTSxDQUFDLEdBQUc7TUFDZCxJQUFJLE1BQU0sQ0FBQyxHQUFHO01BQ2QsSUFBSSxNQUFNO0lBQ1o7SUFDQSxJQUFLLElBQUksSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLEdBQUk7TUFDakMsSUFBSSxTQUFTO01BQ2IsSUFBSSxNQUFNLENBQUMsR0FBRztNQUNkLElBQUksTUFBTSxDQUFDLEtBQUs7TUFDaEIsSUFBSSxNQUFNO0lBQ1o7SUFFQSxJQUFJLFNBQVMsR0FBRztJQUNoQixJQUFJLFNBQVM7SUFDYixJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssSUFBSSxHQUFHLEtBQUssRUFBRSxHQUFHO0lBQ25DLElBQUksSUFBSTtJQUVSLElBQUksU0FBUyxHQUFHO0lBQ2hCLElBQUksSUFBSSxHQUFHO0lBQ1gsSUFBSSxTQUFTLEdBQUc7SUFDaEIsSUFBSSxZQUFZLEdBQUc7SUFDbkIsSUFBSSxRQUFRLENBQUMsT0FBTyxLQUFLO0VBQzNCO0FBQ0YsRUFBeUMifQ==