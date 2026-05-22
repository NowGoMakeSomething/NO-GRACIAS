// Test harness: lanza index.html en Chromium y toma screenshots.
// Uso: node test/screenshot.js <preset>
//   preset puede ser "menu" (default), "playing", "beach", "pool", "buffet", "spa", "escape"
// Las screenshots se guardan en test/out/<preset>.png

const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const PRESET = process.argv[2] || 'menu';
const VIEWPORT = process.argv[3] || 'mobile'; // 'mobile' (360x800) o 'desktop' (1280x800)

const viewports = {
  mobile:  { width: 390, height: 844 }, // iPhone 14 portrait
  desktop: { width: 1280, height: 800 }
};

(async () => {
  const outDir = path.join(__dirname, 'out');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: viewports[VIEWPORT] });
  const page = await context.newPage();
  const fileUrl = 'file://' + path.resolve(__dirname, '..', 'index.html');
  await page.goto(fileUrl);
  await page.waitForLoadState('networkidle');

  // Esperar a que el canvas tenga dimensiones
  await page.waitForFunction(() => {
    const c = document.getElementById('game');
    return c && c.width > 0 && c.height > 0;
  });

  if (PRESET === 'menu') {
    await page.screenshot({ path: path.join(outDir, `menu-${VIEWPORT}.png`) });
  } else {
    // Click "EMPEZAR VACACIONES"
    await page.click('#startBtn');
    await page.waitForTimeout(300);
    // Mover al jugador a la zona deseada (instrumentación vía window.game)
    const teleport = (preset) => {
      const map = {
        playing: null,
        beach: 'beach',
        pool: 'pool',
        buffet: 'buffet',
        spa: 'spa',
        room: 'room'
      };
      if (preset === 'escape') {
        // Spawn closer adyacente al jugador y dispara captura
        const g = window.game;
        const c = g.closers[0];
        c.x = g.player.x + 20; c.y = g.player.y;
        g.startEscape(c);
        return;
      }
      const type = map[preset];
      if (type) {
        const g = window.game;
        const z = g.zones.find(z => z.type === type);
        g.player.x = z.x + z.w/2 - 12;
        g.player.y = z.y + z.h/2 - 12;
      }
    };
    await page.evaluate(teleport, PRESET);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, `${PRESET}-${VIEWPORT}.png`) });

    // HUD: clip a los primeros 110px del top
    if (process.argv[4] === 'hud') {
      const v = viewports[VIEWPORT];
      await page.screenshot({
        path: path.join(outDir, `${PRESET}-${VIEWPORT}-hud.png`),
        clip: { x: 0, y: 0, width: v.width, height: 110 }
      });
    }

    // Si nos pidieron un cuarto argumento "zoom", spawneamos closer al lado
    // del player y tomamos un screenshot recortado al player
    if (process.argv[4] === 'zoom') {
      await page.evaluate(() => {
        const g = window.game;
        // Llevamos al jugador a un punto lejos de zonas (al noreste del mundo)
        // para tener pasto detrás como fondo claro
        g.player.x = 600; g.player.y = 600;
        g.player.dir = 'down';
        // Una closer en patrol mostrando frase, a distancia segura
        if (g.closers[0]) {
          g.closers[0].x = g.player.x + 60;
          g.closers[0].y = g.player.y - 10;
          g.closers[0].state = 'chase';
          g.closers[0].phrase = '¿Tienen 90 minutitos?';
          g.closers[0].phraseTimer = 999;
          g.closers[0].speed = 0;
          g.closers[0].chaseSpeed = 0;
          g.closers[0].targetX = g.closers[0].x;
          g.closers[0].targetY = g.closers[0].y;
        }
        // congelar resto de closers a velocidad 0
        for (let i = 1; i < g.closers.length; i++) {
          g.closers[i].speed = 0;
          g.closers[i].chaseSpeed = 0;
        }
      });
      await page.waitForTimeout(400);
      const v = viewports[VIEWPORT];
      await page.screenshot({
        path: path.join(outDir, `${PRESET}-${VIEWPORT}-zoom.png`),
        clip: { x: v.width/2 - 60, y: v.height/2 - 60, width: 180, height: 140 }
      });
    }
  }

  await browser.close();
  console.log(`screenshot guardado en test/out/${PRESET}-${VIEWPORT}.png`);
})();
