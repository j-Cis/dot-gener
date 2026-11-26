// @project-metadata
// Path: site/scripts/registries/for-island-canvas.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { drawDotxCanvas } from "@/site/common/lang/dotx/render-canvas.ts";
/**
 * Rysunki <canvas> uruchamiane w przeglądarce przez ViewAsCanvas, wybierane przez
 * props: <ViewAsCanvas rysunek="nazwa" ... />.
 *
 * Wszystko, co tu jest, trafia do przeglądarki razem z ViewAsCanvas.
 */ export const RYSUNKI = {
  "dotx": drawDotxCanvas,
  "test": ({ ctx, dane })=>{
    const label = typeof dane === "string" ? dane : "ViewAsCanvas działa";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY2xpZW50L3JlZ2lzdHJpZXMvZm9yLWlzbGFuZC1jYW52YXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyaXB0cy9yZWdpc3RyaWVzL2Zvci1pc2xhbmQtY2FudmFzLnRzXG4vLyBBdXRob3I6IEphbiBSb21hbiBDaXNvd3NraVxuLy8gT1JDSUQ6IGh0dHBzOi8vb3JjaWQub3JnLzAwMDktMDAwOS0yOTA3LTM3OTJcbi8vIFJlcG9zaXRvcnk6IGh0dHBzOi8vZ2l0aHViLmNvbS9qLUNpcy9kb3QtZ2VuZXJcblxuaW1wb3J0IHR5cGUgeyBDYW52YXNEcmF3ZXIgfSBmcm9tIFwiQC9zaXRlL2NsaWVudC9WaWV3QXNDYW52YXMuaXNsYW5kLnRzeFwiO1xuaW1wb3J0IHsgZHJhd0RvdHhDYW52YXMgfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2RvdHgvcmVuZGVyLWNhbnZhcy50c1wiO1xuLyoqXG4gKiBSeXN1bmtpIDxjYW52YXM+IHVydWNoYW1pYW5lIHcgcHJ6ZWdsxIVkYXJjZSBwcnpleiBWaWV3QXNDYW52YXMsIHd5YmllcmFuZSBwcnplelxuICogcHJvcHM6IDxWaWV3QXNDYW52YXMgcnlzdW5laz1cIm5hendhXCIgLi4uIC8+LlxuICpcbiAqIFdzenlzdGtvLCBjbyB0dSBqZXN0LCB0cmFmaWEgZG8gcHJ6ZWdsxIVkYXJraSByYXplbSB6IFZpZXdBc0NhbnZhcy5cbiAqL1xuZXhwb3J0IGNvbnN0IFJZU1VOS0k6IFJlY29yZDxzdHJpbmcsIENhbnZhc0RyYXdlcj4gPSB7XG4gIFwiZG90eFwiOiBkcmF3RG90eENhbnZhcyxcbiAgXCJ0ZXN0XCI6ICh7IGN0eCwgZGFuZSB9KSA9PiB7XG4gICAgY29uc3QgbGFiZWwgPSB0eXBlb2YgZGFuZSA9PT0gXCJzdHJpbmdcIiA/IGRhbmUgOiBcIlZpZXdBc0NhbnZhcyBkemlhxYJhXCI7XG5cbiAgICBjdHguZmlsbFN0eWxlID0gXCIjZjhmOWZhXCI7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIDQwMCwgMjQwKTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBcIiMzMzNcIjtcbiAgICBjdHgubGluZVdpZHRoID0gMjtcbiAgICBjdHguc3Ryb2tlUmVjdCgxLCAxLCAzOTgsIDIzOCk7XG5cbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBcIiNlMGUwZTBcIjtcbiAgICBjdHgubGluZVdpZHRoID0gMTtcbiAgICBmb3IgKGxldCB4ID0gNDA7IHggPCA0MDA7IHggKz0gNDApIHtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oeCwgMCk7XG4gICAgICBjdHgubGluZVRvKHgsIDI0MCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGZvciAobGV0IHkgPSA0MDsgeSA8IDI0MDsgeSArPSA0MCkge1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbygwLCB5KTtcbiAgICAgIGN0eC5saW5lVG8oNDAwLCB5KTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHguZmlsbFN0eWxlID0gXCIjMjU2M2ViXCI7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoMjAwLCAxMjAsIDQ4LCAwLCBNYXRoLlBJICogMik7XG4gICAgY3R4LmZpbGwoKTtcblxuICAgIGN0eC5maWxsU3R5bGUgPSBcIiNmZmZmZmZcIjtcbiAgICBjdHguZm9udCA9IFwiYm9sZCAxNnB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG4gICAgY3R4LmZpbGxUZXh0KGxhYmVsLCAyMDAsIDEyMCk7XG4gIH0sXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9CQUFvQjtBQUNwQixxREFBcUQ7QUFDckQsNkJBQTZCO0FBQzdCLCtDQUErQztBQUMvQyxpREFBaUQ7QUFHakQsU0FBUyxjQUFjLFFBQVEsMkNBQTJDO0FBQzFFOzs7OztDQUtDLEdBQ0QsT0FBTyxNQUFNLFVBQXdDO0VBQ25ELFFBQVE7RUFDUixRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO0lBQ3BCLE1BQU0sUUFBUSxPQUFPLFNBQVMsV0FBVyxPQUFPO0lBRWhELElBQUksU0FBUyxHQUFHO0lBQ2hCLElBQUksUUFBUSxDQUFDLEdBQUcsR0FBRyxLQUFLO0lBQ3hCLElBQUksV0FBVyxHQUFHO0lBQ2xCLElBQUksU0FBUyxHQUFHO0lBQ2hCLElBQUksVUFBVSxDQUFDLEdBQUcsR0FBRyxLQUFLO0lBRTFCLElBQUksV0FBVyxHQUFHO0lBQ2xCLElBQUksU0FBUyxHQUFHO0lBQ2hCLElBQUssSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLEtBQUssR0FBSTtNQUNqQyxJQUFJLFNBQVM7TUFDYixJQUFJLE1BQU0sQ0FBQyxHQUFHO01BQ2QsSUFBSSxNQUFNLENBQUMsR0FBRztNQUNkLElBQUksTUFBTTtJQUNaO0lBQ0EsSUFBSyxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxHQUFJO01BQ2pDLElBQUksU0FBUztNQUNiLElBQUksTUFBTSxDQUFDLEdBQUc7TUFDZCxJQUFJLE1BQU0sQ0FBQyxLQUFLO01BQ2hCLElBQUksTUFBTTtJQUNaO0lBRUEsSUFBSSxTQUFTLEdBQUc7SUFDaEIsSUFBSSxTQUFTO0lBQ2IsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLEVBQUUsR0FBRztJQUNuQyxJQUFJLElBQUk7SUFFUixJQUFJLFNBQVMsR0FBRztJQUNoQixJQUFJLElBQUksR0FBRztJQUNYLElBQUksU0FBUyxHQUFHO0lBQ2hCLElBQUksWUFBWSxHQUFHO0lBQ25CLElBQUksUUFBUSxDQUFDLE9BQU8sS0FBSztFQUMzQjtBQUNGLEVBQUUifQ==