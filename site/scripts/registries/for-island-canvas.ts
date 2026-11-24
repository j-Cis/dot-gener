import type { CanvasDrawer } from "@/site/features/ui/Canvas.island.tsx";
import { drawDotxCanvas } from "../lang/dotx/render-canvas.ts";
/**
 * Rysunki <canvas> uruchamiane w przeglądarce przez Canvas, wybierane przez
 * props: <Canvas rysunek="nazwa" ... />.
 *
 * Wszystko, co tu jest, trafia do przeglądarki razem z Canvas.
 */
export const RYSUNKI: Record<string, CanvasDrawer> = {
  "dotx": drawDotxCanvas,
  "test": ({ ctx, dane }) => {
    const label = typeof dane === "string" ? dane : "Canvas działa";

    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, 400, 240);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 398, 238);

    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    for (let x = 40; x < 400; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 240);
      ctx.stroke();
    }
    for (let y = 40; y < 240; y += 40) {
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
  },
};
