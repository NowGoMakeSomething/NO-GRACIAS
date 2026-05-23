// Smoke test: verifica que el flujo completo del juego funciona
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console error: ${msg.text()}`);
  });

  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.waitForLoadState('networkidle');
  console.log('1. Cargó OK');

  // Verificar que existe window.game
  let state = await page.evaluate(() => window.game?.state);
  console.log(`2. Estado inicial: ${state} (esperado: menu)`);

  // Click start
  await page.click('#startBtn');
  await page.waitForTimeout(500);
  state = await page.evaluate(() => window.game.state);
  console.log(`3. Después de start: ${state} (esperado: playing)`);

  // Mover con WASD
  await page.keyboard.down('d');
  await page.waitForTimeout(300);
  await page.keyboard.up('d');
  const after = await page.evaluate(() => ({ x: window.game.player.x, y: window.game.player.y }));
  console.log(`4. Player movió a (${after.x.toFixed(0)}, ${after.y.toFixed(0)}) tras presionar D`);

  // Trigger escape (poner closer encima)
  await page.evaluate(() => {
    const g = window.game;
    g.closers[0].x = g.player.x + 5;
    g.closers[0].y = g.player.y;
  });
  await page.waitForTimeout(300);
  state = await page.evaluate(() => window.game.state);
  console.log(`5. Estado tras spawn closer: ${state} (esperado: escape)`);

  // Spam SPACE para resistir el escape (el botón tiene pulse animation
  // y Playwright lo considera inestable; el teclado funciona igual)
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press(' ');
    await page.waitForTimeout(20);
  }
  await page.waitForTimeout(200);
  state = await page.evaluate(() => window.game.state);
  console.log(`6. Estado tras spammear NO GRACIAS: ${state} (esperado: playing)`);

  // Forzar game over
  await page.evaluate(() => window.game.gameOver('test'));
  await page.waitForTimeout(200);
  state = await page.evaluate(() => window.game.state);
  console.log(`7. Game over manual: ${state} (esperado: gameover)`);

  // Restart
  await page.click('#retryBtn');
  await page.waitForTimeout(300);
  state = await page.evaluate(() => window.game.state);
  console.log(`8. Restart: ${state} (esperado: playing)`);

  // Forzar win
  await page.evaluate(() => {
    const g = window.game;
    g.dayNumber = 7;
    g.totalTanSum = 5000;
    g.totalTanSamples = 100;
    g.escapesSuccessful = 3;
    g.win();
  });
  await page.waitForTimeout(200);
  state = await page.evaluate(() => window.game.state);
  console.log(`9. Win manual: ${state} (esperado: win)`);

  if (errors.length > 0) {
    console.log('\n!! ERRORES DETECTADOS:');
    for (const e of errors) console.log(`   - ${e}`);
    process.exit(1);
  } else {
    console.log('\n✓ Sin errores. Smoke test OK.');
  }

  await browser.close();
})();
