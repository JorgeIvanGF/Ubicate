import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import axe from 'axe-core';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const baseURL = process.env.UBICATE_URL ?? 'http://127.0.0.1:5173/';
const captureDir = fileURLToPath(new URL('../../../docs/fases/F01/H01/capturas-browser/', import.meta.url));
await mkdir(captureDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const requests = [];
const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
const responses = [];

page.on('request', (request) => requests.push({ url: request.url(), resourceType: request.resourceType() }));
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', (error) => pageErrors.push(error.message));
page.on('requestfailed', (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
page.on('response', (response) => responses.push({ url: response.url(), status: response.status() }));

const output = { baseURL, viewportChecks: [], reproduced: {}, observed: {} };

try {
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Opciones en Tunja' }).waitFor();
  await page.waitForFunction(() => document.querySelectorAll('.maplibregl-marker').length > 0, null, { timeout: 30000 }).catch(() => {});

  // Regression for the PR review observation: keep List selected while crossing
  // from the mobile breakpoint into desktop widths, without pressing Map.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Ver lista' }).click();
  output.observed.listToDesktopResize = [];
  for (const [width, height] of [[390, 844], [768, 1024], [1440, 1000]]) {
    await page.setViewportSize({ width, height });
    if (width > 760) {
      await page.waitForFunction(() => {
        const canvas = document.querySelector('.maplibregl-canvas');
        return canvas && canvas.clientWidth > 0 && canvas.clientHeight > 0 && canvas.width > 0 && canvas.height > 0;
      }, null, { timeout: 10000 });
    }
    await page.waitForTimeout(250);
    const metrics = await page.evaluate(() => {
      const host = document.querySelector('.map-canvas');
      const canvas = document.querySelector('.maplibregl-canvas');
      const hostRect = host.getBoundingClientRect();
      return {
        viewport: { width: innerWidth, height: innerHeight },
        selectedView: document.querySelector('.mobile-switch button[aria-pressed="true"]')?.getAttribute('aria-label'),
        mapDisplay: getComputedStyle(document.querySelector('.map-column')).display,
        container: { width: hostRect.width, height: hostRect.height },
        canvasCss: { width: canvas?.clientWidth ?? 0, height: canvas?.clientHeight ?? 0 },
        canvasBitmap: { width: canvas?.width ?? 0, height: canvas?.height ?? 0 },
        markers: [...document.querySelectorAll('.map-price-marker')].map((marker) => ({
          unitId: marker.getAttribute('data-unit-id'),
          visible: marker.getBoundingClientRect().width > 0 && marker.getBoundingClientRect().height > 0,
        })),
      };
    });
    output.observed.listToDesktopResize.push(metrics);
    if (width === 390) {
      assert.equal(metrics.mapDisplay, 'none', 'en móvil, la vista Lista debe ocultar el mapa');
      assert.equal(metrics.container.width, 0, 'mapa oculto debe medir cero en móvil');
    } else {
      assert.equal(metrics.selectedView, 'Lista 7, ver lista', 'redimensionar no debe cambiar la selección Lista');
      assert.equal(metrics.mapDisplay, 'block', 'CSS de escritorio debe mostrar el mapa al cruzar el breakpoint');
      assert.ok(Math.abs(metrics.container.width - metrics.canvasCss.width) < 1, 'canvas CSS debe coincidir con el ancho del contenedor');
      assert.ok(Math.abs(metrics.container.height - metrics.canvasCss.height) < 1, 'canvas CSS debe coincidir con el alto del contenedor');
      assert.ok(Math.abs(metrics.container.width - metrics.canvasBitmap.width) < 1, 'bitmap debe coincidir con el ancho del contenedor');
      assert.ok(Math.abs(metrics.container.height - metrics.canvasBitmap.height) < 1, 'bitmap debe coincidir con el alto del contenedor');
      assert.equal(metrics.markers.length, 7, 'los siete marcadores deben permanecer en el mapa');
      assert.ok(metrics.markers.every((marker) => marker.visible), 'todos los marcadores deben tener geometría visible');
    }
    await page.screenshot({ path: join(captureDir, `lista-resize-${width}.png`), fullPage: false });
  }
  await page.locator('.map-price-marker[data-unit-id="arrayan-2"]').click();
  assert.ok((await page.locator('.listing-card[data-unit-id="arrayan-2"]').getAttribute('class'))?.includes('is-selected'), 'los marcadores deben seguir seleccionando la unidad correcta tras redimensionar');
  output.observed.listToDesktopResizeSelection = {
    selectedUnitId: 'arrayan-2',
    selectedListing: await page.locator('.listing-card[data-unit-id="arrayan-2"]').getAttribute('class'),
  };
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelectorAll('.maplibregl-marker').length === 7, null, { timeout: 30000 });

  await page.addScriptTag({ content: axe.source });
  output.observed.accessibilityInitial = await page.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
    return result.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, count: nodes.length, nodes: nodes.map((node) => ({ target: node.target, summary: node.failureSummary, checks: node.any.map((check) => check.data) })) }));
  });

  for (const [width, height] of [[320, 844], [390, 844], [768, 1024], [1440, 1000]]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(250);
    const metrics = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      mobileSwitchDisplay: getComputedStyle(document.querySelector('.mobile-switch')).display,
      jsMobile: window.matchMedia('(max-width: 760px)').matches,
      cssMobile: window.matchMedia('(max-width: 760px)').matches,
      mapCanvas: (() => { const r = document.querySelector('.map-canvas')?.getBoundingClientRect(); return r && { width: r.width, height: r.height }; })(),
    }));
    await page.screenshot({ path: join(captureDir, `exploracion-${width}.png`), fullPage: false });
    output.viewportChecks.push({ width, height, ...metrics });
    if (width === 390) {
      output.observed.accessibilityMobile = await page.evaluate(async () => {
        const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
        return result.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, count: nodes.length, targets: nodes.map((node) => node.target) }));
      });
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelectorAll('.maplibregl-marker').length === 7, null, { timeout: 30000 });
  await page.addScriptTag({ content: axe.source });
  assert.equal(await page.locator('.listing-card').count(), 7, 'fixture debe mostrar las siete unidades');
  const markerGeometry = await page.locator('.maplibregl-marker').evaluateAll((markers) => markers.map((marker) => {
    const button = marker.querySelector('button');
    const rect = marker.getBoundingClientRect();
    return { label: button?.getAttribute('aria-label'), x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) };
  }));
  output.observed.markerGeometry = markerGeometry;
  assert.equal(markerGeometry.length, 7, 'cada unidad debe tener marcador accesible');
  assert.equal(new Set(markerGeometry.map(({ x, y }) => `${x},${y}`)).size, markerGeometry.length, 'marcadores coincidentes deben ser distinguibles');

  await page.locator('.map-frame').scrollIntoViewIfNeeded();
  const mapSelectionMarker = page.locator('.map-price-marker[data-unit-id="limon-2"]');
  output.observed.markerPointerHit = await mapSelectionMarker.evaluate((button) => {
    const rect = button.getBoundingClientRect();
    const target = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const frame = document.querySelector('.map-frame').getBoundingClientRect();
    return { markerRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, frameRect: { x: frame.x, y: frame.y, width: frame.width, height: frame.height }, scrollY: window.scrollY, hitTag: target?.tagName, hitClass: String(target?.className ?? '') };
  });
  assert.ok(output.observed.markerPointerHit.markerRect.x >= output.observed.markerPointerHit.frameRect.x && output.observed.markerPointerHit.markerRect.x < output.observed.markerPointerHit.frameRect.x + output.observed.markerPointerHit.frameRect.width, 'unidad seleccionada debe quedar dentro del mapa');
  assert.ok(output.observed.markerPointerHit.markerRect.y >= output.observed.markerPointerHit.frameRect.y && output.observed.markerPointerHit.markerRect.y < output.observed.markerPointerHit.frameRect.y + output.observed.markerPointerHit.frameRect.height, 'unidad seleccionada debe quedar dentro del mapa');
  assert.equal(output.observed.markerPointerHit.hitClass, 'map-price-marker', 'el punto de clic debe acertar al botón del marcador');
  await mapSelectionMarker.click();
  assert.equal((await page.locator('.listing-card[data-unit-id="limon-2"]').getAttribute('class'))?.includes('is-selected'), true, 'selección de mapa debe señalar la unidad correspondiente en lista');
  assert.ok(await page.locator('.map-approx-note').textContent().then((value) => value?.toLocaleLowerCase('es').includes('aproximadas')), 'mapa debe declarar ubicaciones aproximadas');

  await page.getByLabel('Zona de Tunja').fill('Centro');
  await page.getByLabel('Precio máximo').selectOption('750000');
  await page.getByLabel('Amoblada').check();
  await page.waitForTimeout(150);
  output.observed.combinedFilters = { listings: await page.locator('.listing-card').count(), markers: await page.locator('.maplibregl-marker').count() };
  assert.deepEqual(output.observed.combinedFilters, { listings: 2, markers: 2 });
  await page.getByLabel('Zona de Tunja').fill('Zona inexistente');
  assert.equal(await page.getByText('No encontramos opciones con esos filtros').count(), 1, 'debe aparecer estado vacío');
  assert.equal(await page.locator('.maplibregl-marker').count(), 0, 'mapa debe reflejar filtro vacío');
  await page.getByRole('button', { name: 'Ver todos los alojamientos' }).click();
  assert.equal(await page.locator('.listing-card').count(), 7, 'limpiar desde estado vacío restaura fixtures');
  assert.equal(await page.locator('a[href*="wa.me"], a[href*="360"]').count(), 0, 'el recorrido no debe activar WhatsApp ni 360');

  const unitTwo = page.locator('.listing-main').filter({ hasText: 'Habitación 2' });
  await unitTwo.click();
  await page.waitForFunction(() => document.activeElement?.getAttribute('data-unit-id') === 'arrayan-2', null, { timeout: 3000 }).catch(() => {});
  output.reproduced.listSelectionFocusedMarker = await page.evaluate(() => ({
    activeLabel: document.activeElement?.getAttribute('aria-label'),
    activeUnitId: document.activeElement?.getAttribute('data-unit-id'),
    activeTag: document.activeElement?.tagName,
    activeClass: document.activeElement?.className,
    activeText: document.activeElement?.textContent?.trim().slice(0, 80),
    targetExists: Boolean(document.querySelector('.map-price-marker[data-unit-id="arrayan-2"]')),
    targetLabel: document.querySelector('.map-price-marker[data-unit-id="arrayan-2"]')?.getAttribute('aria-label'),
    selectedMarkerIds: [...document.querySelectorAll('.map-price-marker.is-selected')].map((marker) => marker.getAttribute('data-unit-id')),
  }));
  assert.equal(output.reproduced.listSelectionFocusedMarker.activeUnitId, 'arrayan-2', 'selección de lista debe enfocar marcador por ID de unidad');

  const selectedUnitTwo = page.locator('.listing-card[data-unit-id="arrayan-2"] .detail-arrow');
  const detailTrigger = selectedUnitTwo;
  await detailTrigger.click();
  await page.getByRole('dialog').waitFor();
  assert.equal(await page.locator('.unit-row').count(), 2, 'ficha debe mostrar las dos unidades del inmueble');
  assert.ok(await page.getByText('Ubicación aproximada', { exact: true }).count() > 0, 'ficha debe advertir que el punto es aproximado');
  output.observed.accessibilityDialog = await page.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
    return result.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, count: nodes.length, nodes: nodes.map((node) => ({ target: node.target, summary: node.failureSummary, checks: node.any.map((check) => check.data) })) }));
  });
  output.observed.dialogInitialFocus = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  await page.keyboard.press('Shift+Tab');
  output.observed.dialogShiftTabFocus = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  await page.keyboard.press('Tab');
  output.observed.dialogTabFocus = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  await page.keyboard.press('Escape');
  output.observed.dialogEscapeClosed = await page.getByRole('dialog').count() === 0;
  output.observed.dialogFocusRestored = await detailTrigger.evaluate((element) => document.activeElement === element);

  await page.setViewportSize({ width: 720, height: 900 });
  await page.getByRole('button', { name: 'Ver lista' }).click();
  await page.locator('.listing-main').first().click();
  await page.waitForTimeout(180);
  output.reproduced.breakpoint720 = await page.evaluate(() => ({
    listVisible: getComputedStyle(document.querySelector('.list-column')).display !== 'none',
    mapVisible: getComputedStyle(document.querySelector('.map-column')).display !== 'none',
    jsMobile: matchMedia('(max-width: 760px)').matches,
    cssMobile: matchMedia('(max-width: 760px)').matches,
    activeView: document.querySelector('.mobile-switch button[aria-pressed="true"]')?.getAttribute('aria-label'),
  }));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Ver lista' }).click();
  await page.locator('.listing-main').first().click();
  await page.waitForTimeout(180);
  output.observed.toggleKeyboard = await (async () => {
    await page.getByRole('button', { name: 'Ver lista' }).focus();
    await page.keyboard.press('Enter');
    return page.evaluate(() => ({ activeElement: document.activeElement?.getAttribute('aria-label'), mapPressed: document.querySelector('.mobile-switch button:first-child')?.getAttribute('aria-pressed'), listPressed: document.querySelector('.mobile-switch button:nth-child(2)')?.getAttribute('aria-pressed') }));
  })();
  assert.deepEqual(output.observed.toggleKeyboard, { activeElement: 'Lista 7, ver lista', mapPressed: 'false', listPressed: 'true' });
  await page.getByRole('button', { name: 'Ver lista' }).click();
  const hiddenCanvasWidth = await page.locator('.map-canvas').evaluate((element) => element.getBoundingClientRect().width);
  await page.getByRole('button', { name: 'Ver mapa' }).click();
  await page.waitForTimeout(150);
  output.observed.mapResizeAfterVisibility = await page.locator('.map-canvas').evaluate((element) => ({
    containerWidth: element.getBoundingClientRect().width,
    canvasWidth: element.querySelector('canvas')?.getBoundingClientRect().width ?? 0,
  }));
  output.observed.mapResizeHiddenWidth = hiddenCanvasWidth;
  assert.equal(hiddenCanvasWidth, 0);
  assert.ok(Math.abs(output.observed.mapResizeAfterVisibility.containerWidth - output.observed.mapResizeAfterVisibility.canvasWidth) < 1, 'map.resize debe coincidir con el contenedor tras volver a mostrar el mapa');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByLabel('Zona de Tunja').fill('Centro');
  await page.getByLabel('Precio máximo').selectOption('750000');
  await page.getByLabel('Amoblada').check();
  assert.equal(await page.locator('.listing-card').count(), 2, 'el filtro compuesto previo al fallo debe dejar dos resultados');
  await page.route('https://tiles.openfreemap.org/**', (route) => route.fulfill({ status: 503, contentType: 'text/plain', body: 'synthetic tile outage for local QA' }));
  await page.locator('.maplibregl-ctrl-zoom-in').click().catch(() => {});
  await page.waitForTimeout(2500);
  output.reproduced.tileOutage = {
    alertCount: await page.getByRole('alert').count(),
    mapUnavailableVisible: await page.getByRole('heading', { name: 'El mapa no está disponible' }).count() > 0,
    filterStillVisible: await page.getByLabel('Zona de Tunja').isVisible(),
    listingCount: await page.locator('.listing-card').count(),
    zoneValue: await page.getByLabel('Zona de Tunja').inputValue(),
    priceValue: await page.getByLabel('Precio máximo').inputValue(),
    featureChecked: await page.getByLabel('Amoblada').isChecked(),
    failedTiles: responses.filter((item) => item.url.includes('tiles.openfreemap.org') && item.status === 503).map((item) => item.url),
    tileRequestCount: requests.filter((item) => item.url.includes('tiles.openfreemap.org')).length,
  };
  assert.equal(output.reproduced.tileOutage.listingCount, 2, 'lista debe conservar resultados filtrados durante el fallo');
  assert.equal(output.reproduced.tileOutage.zoneValue, 'Centro');
  assert.equal(output.reproduced.tileOutage.priceValue, '750000');
  assert.equal(output.reproduced.tileOutage.featureChecked, true);
  await page.screenshot({ path: join(captureDir, 'tile-outage.png'), fullPage: true });

  await page.unroute('https://tiles.openfreemap.org/**');
  await page.getByRole('button', { name: 'Reintentar mapa' }).click();
  await page.waitForFunction(() => document.querySelectorAll('.maplibregl-marker').length > 0, null, { timeout: 30000 }).catch(() => {});
  output.observed.retryResult = {
    alertCount: await page.getByRole('alert').count(),
    markers: await page.locator('.maplibregl-marker').count(),
    listingCount: await page.locator('.listing-card').count(),
  };
  assert.equal(output.observed.retryResult.alertCount, 0, 'reintento debe quitar estado de error');
  assert.equal(output.observed.retryResult.markers, 2, 'reintento debe volver a cargar los marcadores filtrados');
  assert.equal(output.observed.retryResult.listingCount, 2, 'reintento debe conservar el resultado filtrado');

  for (const [width, height] of [[320, 844], [390, 844], [768, 1024], [1440, 1000]]) {
    await page.setViewportSize({ width, height });
    await page.locator('.map-frame').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: join(captureDir, `mapa-${width}.png`), fullPage: false });
  }

  output.observed.networkHosts = [...new Set(requests.map((request) => {
    try { return new URL(request.url).host; } catch { return 'invalid'; }
  }))].sort();
  output.observed.supabaseRequests = requests.filter((request) => /supabase\.(co|com)|supabase/i.test(request.url));
  output.observed.consoleErrors = consoleErrors;
  output.observed.pageErrors = pageErrors;
  output.observed.failedRequests = failedRequests;
  output.observed.errorResponses = responses.filter((item) => item.status >= 400);
  assert.deepEqual(output.observed.supabaseRequests, [], 'no debe haber solicitudes a Supabase');
  const externalHosts = output.observed.networkHosts.filter((host) => !host.startsWith('127.0.0.1:'));
  assert.deepEqual(externalHosts, ['tiles.openfreemap.org'], 'solo OpenFreeMap puede ser host externo');
  assert.deepEqual(consoleErrors, [], 'no debe haber errores de consola en el recorrido normal ni al simular 503 de tiles');
  assert.deepEqual(pageErrors, [], 'no debe haber errores JavaScript de página');
  assert.deepEqual(output.observed.accessibilityInitial, [], 'axe WCAG 2.2 A/AA debe pasar en la vista inicial');
  assert.deepEqual(output.observed.accessibilityMobile, [], 'axe WCAG 2.2 A/AA debe pasar en viewport móvil');
  assert.deepEqual(output.observed.accessibilityDialog, [], 'axe WCAG 2.2 A/AA debe pasar con el diálogo abierto');
  const reportPath = join(captureDir, 'browser-qa-result.json');
  await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(output, null, 2));
} finally {
  await browser.close();
}
