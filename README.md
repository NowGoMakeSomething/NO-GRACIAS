# NO GRACIAS: Time Share Survival

A single-file vanilla JS / Canvas survival game. Sátira marketera del timeshare en la Riviera Maya.

Sobrevive 7 días en un resort all-inclusive evitando a las **closers de timeshare** mientras mantienes tus barras de Energía, Hambre y Bronceado.

## 🎮 Jugar online

👉 **[nowgomakesomething.github.io/NO-GRACIAS/](https://nowgomakesomething.github.io/NO-GRACIAS/)**

O abre `index.html` directamente en cualquier navegador moderno — sin dependencias, sin build, sin assets externos.

## Controles

- **Escritorio**: `WASD` o flechas para moverte, `ESPACIO` para interactuar / decir NO, `ESC` para pausar.
- **Móvil**: joystick virtual abajo a la izquierda, botón rojo "NO, GRACIAS" abajo a la derecha.

## Zonas

- 🏖️ **Playa** — recarga Bronceado
- 🏊 **Piscina** — recarga Bronceado + Energía
- 🍤 **Buffet** — recarga Hambre
- 💆 **Spa** — zona segura, recarga Energía al 100%
- 🛏️ **Habitación** — zona 100% segura, duerme para avanzar al siguiente día

## Las Closers

Mujeres rubias con vestido turquesa que patrullan el mapa. Si te detectan dentro de 150 px te persiguen con frases reales del sector:

> *"¿Tienen 90 minutitos?"*
> *"Es una inversión, no un gasto"*
> *"Mi gerente autoriza..."*

Si te tocan, te llevan a la sala de ventas. Aprieta el botón **NO, GRACIAS** repetidamente para escapar antes de que tu paciencia llegue a 0.

## Stack

- Un solo archivo HTML
- Vanilla JS + `<canvas>` con `fillRect`
- Pixel art generado en runtime, sin sprites externos
- Pointer Events para soporte unificado de teclado, mouse y táctil

## Deploy

GitHub Pages servido desde `main` rama, `/(root)` directorio.
