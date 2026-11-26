// @project-metadata
// Path: site/scripts/registries/for-island-canvas.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { CanvasDrawer } from "@/site/client/VectorViewport.island.tsx";
import { drawDotxCanvas } from "@/site/common/lang/dotx/render-canvas.ts";
/**
 * Rysunki <canvas> uruchamiane w przeglądarce przez VectorViewport:
 * <VectorViewport renderer="Canvas" sourceFormat="CANVAS" source={RYSUNKI.nazwa} scene={[w, h]} />.
 * Serwer odnajduje funkcję w tym rejestrze i przekazuje przeglądarce jej klucz.
 *
 * Wszystko, co tu jest, trafia do przeglądarki razem z VectorViewport.
 */
export const RYSUNKI = {
  "dotx": drawDotxCanvas,
  "test": ({ ctx, dane }) => {
    const label = typeof dane === "string" ? dane : "VectorViewport działa";

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
} satisfies Record<string, CanvasDrawer>;
