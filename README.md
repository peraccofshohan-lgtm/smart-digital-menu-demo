# Smart Digital Menu — MATI

A complete, static restaurant sales demo for **MATI / মাটি**, a fictional premium Bengali kitchen. Designed for restaurant owners in Bangladesh: editorial food photography, warm ivory and forest-green colours, Bengali and English menu typography, and a straightforward WhatsApp-ready ordering experience.

**No framework, build step, backend, database, runtime dependency, paid API or external font/image request.** The optional npm dependencies are development-only browser testing tools.

## Preview

Open `index.html` directly, or use the recommended local server:

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Visit `http://localhost:3000`. In Arena, use the **MATI · Smart Digital Menu** live preview. Python's server is for development, not production hosting.

## Features

- Bespoke responsive hero, signature dish feature, story, visiting information and professional footer.
- Six realistic sample dishes, each with local food imagery, English and Bengali names, descriptions and BDT prices.
- Five category filters; English/Bengali search; vegetarian toggle; helpful empty state and reset.
- EN / বাংলা toggle changes menu names, descriptions, categories, prices and add buttons. The editorial site and checkout remain English.
- Basket with quantity controls, totals, allergy information, special requests and a maximum of 20 servings per dish.
- Basket saved locally on the device; safely falls back to session memory if local storage is unavailable.
- WhatsApp message preview and properly encoded sharing link. **Sharing is never automatic.**
- Mobile navigation, keyboard-accessible native dialogs, focus handling, live notifications, skip link, reduced-motion support and semantic landmarks.
- Local WOFF2 fonts, responsive WebP images, lazy loading below the fold, prioritised hero image, descriptive metadata and favicon.

## Demo safeguards

MATI is not a real business. The menu, prices, opening hours and neighbourhood are illustrative. There are no fabricated reviews, ratings, street addresses, telephone numbers or testimonials.

The WhatsApp number is deliberately empty. The link opens WhatsApp's **contact chooser**, allowing a visitor to share a clearly labelled demo order with a contact they choose. No order is submitted to a restaurant, no payment is taken, and no delivery charge is invented. The location link opens the actual Dhanmondi neighbourhood—not a fabricated restaurant listing.

The website stores only dish IDs and quantities in `localStorage` under `mati-cart`. Notes are not persisted. No analytics, trackers or cookies are included. WhatsApp and Google Maps are external services subject to their own policies.

## Files

```text
index.html          Semantic page, navigation, content and dialogs
styles.css          Responsive visual system and interaction states
app.js              Menu data, filters, localisation and ordering logic
assets/             Optimised images, fonts, font licences and favicon
tests/smoke.cjs     Repeatable browser interaction/accessibility tests
package.json        Optional test scripts and dev dependencies
package-lock.json   Locked test dependencies
```

## Customise for a real restaurant

1. Update the `menu` array in `app.js`. Each dish has a stable `id`, English/Bengali text, price, category, image basename, badge, portion, vegetarian flag and allergens. Use trusted, owner-reviewed content; the renderer is not a CMS for untrusted HTML.
2. Add appropriately licensed WebP images to `assets/`. Cards use `<basename>-small.webp`; hero and story have larger variants. If changing the number of dishes, also update the “All dishes” count in HTML and the English label in the language handler.
3. Set `RESTAURANT_WHATSAPP` in `app.js` to an owner-verified international number, **digits only, with country code** (no plus sign, spaces or punctuation). The link then opens that restaurant's chat.
4. Review all prices, portion sizes, tax wording, allergens and cross-contamination policy with the restaurant. Vegetarian does not mean vegan. The sample dishes containing dairy/nuts must not be presented as allergy-safe.
5. Replace the brand, story, real address, opening hours and map link in `index.html`. Add a verified telephone/contact link if appropriate. Replace AI imagery with actual dishes before representing a real business.
6. Explicitly adapt the demo warning and WhatsApp message wording for a live operation; simply entering a number does **not** remove the safeguards. Define delivery, pickup, confirmation and payment policies.
7. Update title, description, theme/favicon, social metadata and ownership text. Add a canonical URL, absolute `og:image`, sitemap and accurate Restaurant structured data once the real production domain and business details are known. No invented business schema is shipped.
8. Retest on physical Android devices and with the restaurant's WhatsApp account before launch.

## Free deployment

### GitHub Pages

For a repository eligible for free GitHub Pages hosting:

1. Commit and push these files to the intended publishing branch. Work from this session is on `arena/3c6acb73-smart-digital-menu-demo`; review/merge it before publishing from `main`, if that is your preferred workflow.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select the branch containing this site, and select **/(root)**.
4. Save and wait for GitHub's deployment to complete. Use the URL displayed by Pages.

All website asset paths are relative, so repository subpaths work. No build command, secrets or custom domain are needed. Publish only `index.html`, `styles.css`, `app.js` and `assets/` if using a host with a separate deployment folder.

### Other static hosts

The same files can be uploaded to a free static-site host such as Cloudflare Pages or Netlify using its free subdomain. Select no framework and no build command. Use the repository root as the publish directory, or upload just the four website entries above. Check current free-plan terms; no service has been activated or purchased as part of this project.

## Repeatable checks

With Node.js 20+ and the preview server running in another terminal:

```sh
npm ci
npx playwright install chromium
npm run check
npm test
```

On a Linux machine missing browser libraries, use `npx playwright install --with-deps chromium` if permitted. `BASE_URL` overrides the default `http://127.0.0.1:3000`; `CHROMIUM_PATH` can point to an existing Chromium executable. Browser downloads require network access. Runtime hosting does not require npm or Playwright.

`tests/smoke.cjs` checks menu counts, categories, Bengali search, empty states, vegetarian filtering, order arithmetic, quantity changes, encoded WhatsApp notes, Escape dismissal, persistence, language switching, navigation, local image loading and runtime errors. It checks horizontal overflow at **320, 360, 390, 412, 768, 1024 and 1440px**, and runs axe-core WCAG A/AA scans on the mobile page and order dialog.

## Final quality checklist

Completed in the implementation environment using headless Chromium:

- [x] All six menu images load successfully; no external image hotlinks.
- [x] Search, all category controls, vegetarian filtering and empty-state reset work.
- [x] Bengali text search and menu language toggle work.
- [x] Basket quantities, totals and local persistence work.
- [x] WhatsApp URL encoding preserves special requests; no automatic submission.
- [x] Keyboard Escape closes the basket; mobile navigation closes after following a link.
- [x] No JavaScript syntax or runtime errors in tested flows.
- [x] No page-level horizontal overflow at the seven tested viewport widths.
- [x] Desktop and mobile screenshots reviewed; small-screen hero overflow fixed.
- [x] Main page desktop, mobile page and order dialog axe WCAG A/AA scans report zero violations after contrast improvements.
- [x] Reduced motion, image dimensions, lazy loading, local fonts and responsive imagery implemented.
- [x] No fake ratings, real-business impersonation, paid integrations or unfinished content placeholders.
- [x] Deployment and business customisation instructions included.

Automated checks are not a guarantee of complete accessibility or real-device performance. No Lighthouse score or full screen-reader certification is claimed.

## Known limitations

- This is a polished sales demo, not a transactional ordering system. There is no server validation, inventory, payment, reservation, delivery calculation, order tracking or admin panel.
- A person must choose to open/share the WhatsApp message; WhatsApp availability depends on the visitor's device/account. Actual message delivery and external map behaviour were not tested by sending messages or contacting anyone.
- Only the menu is bilingual, not every editorial or checkout string. The language choice is not persisted.
- Modern browsers with native `<dialog>`, CSS Grid and WebP are expected. Older Android WebViews may need a dialog polyfill. Physical Android, iOS Safari and assistive-technology testing remains a pre-launch step.
- JavaScript is required for menu filtering and the basket. A basic menu summary and the full editorial page remain available without it.
- Basket data is local to a browser, not shared across devices; there is no offline service worker.
- Dish and font assets are bundled locally; the full asset directory is approximately 1.2 MB. Real transferred bytes vary by viewport and lazy-loading behaviour.

## Asset provenance

All six food photographs were AI-generated specifically for this fictional concept and converted into optimised WebP assets. They are illustrative, not photographs of an actual restaurant's servings. No image-search results are shipped.

Fonts: **DM Serif Display**, **Manrope**, and **Noto Serif Bengali**, obtained from the Google Fonts repository and self-hosted in WOFF2 format. Their SIL Open Font License texts are included alongside the font files in `assets/`. Preserve those licences when redistributing the fonts.
