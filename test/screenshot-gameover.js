// Screenshot the game over and win screens
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.waitForLoadState('networkidle');

  // Test game over
  await page.click('#startBtn');
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    window.game.gameOver('Te quedaste sin energía. Te fuiste del resort sin disfrutar.');
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(__dirname, 'out', 'gameover-desktop.png') });

  // Test win
  await page.click('#retryBtn');
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const g = window.game;
    g.dayNumber = 7;
    g.totalTanSum = 5000;
    g.totalTanSamples = 100;
    g.escapesSuccessful = 4;
    g.win();
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(__dirname, 'out', 'win-desktop.png') });

  await browser.close();
  console.log('saved gameover and win screenshots');
})();
