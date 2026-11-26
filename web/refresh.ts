/** Samoczynne przeładowanie strony po restarcie serwera (deno task czytaj-pisz). */
export const PRZELADUJ = Deno.env.get("PRZELADUJ") === "1";

/** Inny przy każdym uruchomieniu serwera. */
const URUCHOMIENIE = crypto.randomUUID();

/** Strumień SSE: identyfikator uruchomienia; połączenie zostaje otwarte aż do restartu. */
export const strumien = () =>
  new Response(
    new ReadableStream({
      start(k) {
        k.enqueue(new TextEncoder().encode(`retry: 300\ndata: ${URUCHOMIENIE}\n\n`));
      },
    }),
    { headers: { "content-type": "text/event-stream", "cache-control": "no-cache" } },
  );

/** Skrypt dla przeglądarki: inny identyfikator po ponownym połączeniu → przeładuj. */
export const SKRYPT = `(()=>{let id;new EventSource("/__przeladuj").onmessage=(e)=>{if(id&&id!==e.data)location.reload();id=e.data;};})();`;
