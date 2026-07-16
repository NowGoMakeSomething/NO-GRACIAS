import { getStore } from "@netlify/blobs";

// Guarda los ratings de las latas de Pablo en Netlify Blobs.
// GET  /api/latas          -> { ok: true, data: { [slug]: { rating, review, at } } }
// POST /api/latas          -> upsert { slug, rating (1-5), review } | { slug, remove: true }
export default async (req: Request) => {
  const headers: Record<string, string> = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });

  const store = getStore({ name: "latas-de-pablo", consistency: "strong" });

  if (req.method === "GET") {
    const data = ((await store.get("ratings", { type: "json" })) ?? {}) as Record<string, unknown>;
    return new Response(JSON.stringify({ ok: true, data }), { headers });
  }

  if (req.method === "POST") {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "json inválido" }), { status: 400, headers });
    }

    const slug = typeof body?.slug === "string" ? body.slug.slice(0, 64) : "";
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
      return new Response(JSON.stringify({ ok: false, error: "slug inválido" }), { status: 400, headers });
    }

    const data = ((await store.get("ratings", { type: "json" })) ?? {}) as Record<string, unknown>;

    if (body?.remove === true) {
      delete data[slug];
    } else {
      const rating = Number(body?.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return new Response(JSON.stringify({ ok: false, error: "rating debe ser 1-5" }), { status: 400, headers });
      }
      const review = typeof body?.review === "string" ? body.review.slice(0, 600) : "";
      data[slug] = { rating, review, at: new Date().toISOString() };
    }

    await store.setJSON("ratings", data);
    return new Response(JSON.stringify({ ok: true, data }), { headers });
  }

  return new Response(JSON.stringify({ ok: false, error: "método no permitido" }), { status: 405, headers });
};

export const config = { path: "/api/latas" };
