# 🥤 Las Latas de Pablo — regalo de cumpleaños

Landing page del regalo: **21 latas de todo el mundo** para Pablo. Él las va
abriendo, las califica de **1 a 5 latitas** (1 = muy mala, 5 = muy buena) y deja
su review. Quien regala puede abrir el mismo link y ver el ranking y las
reviews **en vivo**.

## 🚀 Cómo obtener el link (una sola vez, ~2 minutos)

La página necesita un lugar que guarde los datos. Está lista para **Netlify**
(gratis):

1. Mergeá esta rama a `main` (o elegí esta rama en el paso 3).
2. Entrá a <https://app.netlify.com/start> e iniciá sesión con GitHub.
3. Elegí el repo `NowGoMakeSomething/NO-GRACIAS`. La configuración ya viene en
   `netlify.toml` (publica la carpeta `pablo/` y activa la función que guarda
   los ratings) — no toques nada y dale **Deploy**.
4. Netlify te da un link tipo `https://<nombre>.netlify.app` → **ese es el link
   para mandarle a Pablo** 🎁 (podés cambiar el nombre del sitio en
   *Site settings → Change site name*, por ejemplo `las-latas-de-pablo`).

Con eso los veredictos de Pablo quedan guardados en la nube (Netlify Blobs) y
vos ves su ranking entrando al mismo link (se actualiza solo cada 20 segundos).

### ¿Y si lo abro sin Netlify?

La página funciona igual en cualquier hosting estático (GitHub Pages, etc.):
detecta que no hay servidor y pasa a **modo local** — guarda los ratings en el
dispositivo de Pablo y él puede mandarte el ranking con el botón de WhatsApp.

## 🗂 Qué hay acá

- `index.html` — toda la página (colección, ranking, modal de calificación,
  confetti, modo local/nube).
- `assets/cans/*.jpg` — las 21 latas recortadas de la foto original.
- `assets/pablo.jpg` / `assets/pablo-alt.jpg` — fotos de Pablo (fallback del hero).
- `assets/piramide.jpg` — la pirámide completa.
- `assets/og.jpg` + `assets/favicon.svg` — imagen para compartir y favicon.
- `../netlify/functions/latas.mts` — API que guarda los ratings (Netlify Blobs).
- Hero de Pablo generado con Higgsfield (con fallback a la foto real si el
  enlace externo no carga).

## 🔧 API (cuando corre en Netlify)

- `GET /api/latas` → `{ ok, data: { [lata]: { rating, review, at } } }`
- `POST /api/latas` con `{ "slug": "fanta-grape", "rating": 5, "review": "..." }`
- `POST /api/latas` con `{ "slug": "fanta-grape", "remove": true }` para borrar.
