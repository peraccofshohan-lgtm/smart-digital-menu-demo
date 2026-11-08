const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ["--no-sandbox"],
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:3000");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);

  const assert = (v, msg) => {
    if (!v) throw new Error(msg);
    console.log("PASS " + msg);
  };
  assert(
    (await page.locator(".food-card").count()) === 6,
    "six initial dishes",
  );
  await page.click('[data-category="mains"]');
  assert(
    (await page.locator(".food-card").count()) === 2,
    "category filtering",
  );
  await page.click('[data-category="all"]');
  await page.fill("#search", "ইলিশ");
  assert((await page.locator(".food-card").count()) === 1, "Bengali search");
  await page.fill("#search", "notfound");
  assert(await page.locator("#empty-state").isVisible(), "empty state");
  await page.click("#reset-filters");
  await page.check("#vegetarian");
  assert((await page.locator(".food-card").count()) === 2, "vegetarian filter");
  await page.uncheck("#vegetarian");
  await page.click('[data-add="kacchi"]');
  await page.click('[data-add="bhuna"]');
  await page.click(".bag-button");
  assert(
    (await page.locator("#subtotal").textContent()) === "৳830",
    "basket totals",
  );
  await page.click('[data-adjust="kacchi"][data-delta="1"]');
  assert(
    (await page.locator("#subtotal").textContent()) === "৳1,280",
    "quantity totals",
  );
  await page.fill("#order-notes", "Less spice & no nuts");
  await page.click("#preview-order");
  const url = await page.locator("#whatsapp-link").getAttribute("href");
  assert(
    url.startsWith("https://wa.me/?text=") &&
      decodeURIComponent(url).includes("Less spice & no nuts"),
    "encoded WhatsApp contact chooser",
  );
  await page.press("#whatsapp-link", "Escape");
  assert(
    !(await page.locator("#order-dialog").isVisible()),
    "Escape closes dialog",
  );
  await page.reload();
  assert(
    (await page.locator(".bag-count").textContent()) === "3",
    "basket persists",
  );
  await page.click("#language");
  assert(
    (await page.locator(".food-title-row h3").first().textContent()) ===
      "পুরান ঢাকার কাচ্চি",
    "Bengali menu toggle",
  );
  await page.click("#language");
  for (const width of [320, 360, 390, 412, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `no horizontal overflow at ${width}px`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click(".mobile-toggle");
  assert(await page.locator("#mobile-nav").isVisible(), "mobile menu opens");
  await page.click('#mobile-nav a[href="#menu"]');
  assert(
    !(await page.locator("#mobile-nav").isVisible()),
    "mobile menu closes after navigation",
  );
  await page.evaluate(() =>
    document.querySelectorAll("img").forEach((img) => (img.loading = "eager")),
  );
  await page.waitForTimeout(1000);
  assert(
    await page.evaluate(() =>
      [...document.images].every((im) => im.complete && im.naturalWidth > 0),
    ),
    "all food images load",
  );
  assert(errors.length === 0, "no JavaScript runtime errors");
  await page.addScriptTag({ path: require.resolve("axe-core") });
  const a11y = await page.evaluate(() =>
    axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    }),
  );
  assert(
    a11y.violations.length === 0,
    "mobile accessibility scan: " + a11y.violations.map((v) => v.id).join(", "),
  );
  await page.click(".bag-button");
  const modalA11y = await page.evaluate(() =>
    axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    }),
  );
  assert(
    modalA11y.violations.length === 0,
    "order dialog accessibility scan: " +
      modalA11y.violations.map((v) => v.id).join(", "),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
