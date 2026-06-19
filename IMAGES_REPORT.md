# Product Images — Library, Quotes, Website (Part 2)

Generated 2026-06-19. Spans the website repo (this repo) and the CRM repo
(`Labex_CRM`, a separate git project).

## Summary

| Part | Outcome |
|------|---------|
| A — Image library | 539 source images ingested & optimised; **76** match a real product code (9 in the website catalogue, 76 in the full price list); 463 unmatched |
| B — CRM quotes | **68** product images wired into quote line items by code; AD1020 verified rendering at R25,260.30 |
| C — Website | **9** catalogue products now show real photos via the build pipeline |
| D — Catalogue PDF | 652 image proposals extracted & scored; **44** high-confidence shortlist; **0 auto-applied** (gated for human review) |

The big number to know: the `Images/` filenames are mostly **supplier**
catalogue codes (Consort `C3011`, Brookfield `DV-11`, Gemmy `DB 005`…), which
are *not* Labex's internal product codes. Only codes that map to a real Labex
code (catalogue or price list) can be wired safely — hence 76 of 539, not all.

---

## A — Image library (`scripts/build-image-library.mjs`)

- Ingested **539** image files under `Images/` (incl. the unzipped
  `PROLAB IMAGES.zip`). Code = filename stem, brand = subfolder.
- Optimised each to max 600px, compressed (mozjpeg q78 / palettised PNG) into
  `Images/_optimized/`. **Originals untouched.**
- Matched each code **exactly, case-insensitively** against the real product-code
  universe: `labex-real-catalogue.csv` (1,213 website codes) and
  `ItemExport.csv` (21,286 price-list codes).

| Metric | Count |
|--------|-------|
| Source images optimised | 539 |
| Match website catalogue (exact) | 9 |
| Match price list (exact) | 76 |
| Unmatched (supplier-only codes) | 463 |
| Duplicate-code files held back | 28 |
| Non-clean filenames flagged | 2 |
| Distinct codes wired → CRM | 68 |
| Distinct codes wired → website | 9 |

**Manifest:** `image-library-manifest.json` (code → optimised path + brand +
match status, all 539 entries).

### Flagged — never guessed (per the "a wrong image is a real error" rule)

- **Duplicate / colliding codes (28 files), held back from wiring.** Examples:
  `132` (root + Scientific Engineering), `PW` (Adams + Healforce),
  `ROP5` (root + Healforce), `4124000` (×2 in IKA), and **`C5020T`** — a clean
  `C5020T.JPG` *and* a fused-extension `C5020TJPG.jpg` both claim the same code.
  Where two files claim one real code, **both** are withheld for a human to pick.
- **Non-clean filenames (2):** `CONSORT/C5020TJPG`, `Labcon/FSOM 24JPG` — the
  image extension is fused onto the code with no dot. Listed, not auto-trusted.
- **Empty source folders:** `Miele`, `National Lab` (Miele is a dropped brand
  anyway). Non-image files in `Images/` (1 `.docx`, 2 `.htm`) were skipped.

---

## B — CRM quotes wired to images (`Labex_CRM`)

- 68 optimised images copied to `apps/web/public/products/<code>.<ext>`;
  lookup `apps/web/src/lib/pdf/product-images.json` (code → path).
- `apps/web/src/lib/pdf/product-images.ts` resolves a line's image by
  `product_code` (cached data URI). Applied at **both** PDF render sites (the
  `/api/quotes/[id]/pdf` route and the send-quote email in `quotes.ts`), so
  `getFullQuote` stays pure and the draft editor isn't polluted.
- **Manual per-line image add/override still wins** — the library image is only
  a fallback when a line has no manual image. No match → the image cell stays
  empty (layout unaffected, as reserved in Part 1).
- **Verified:** a test quote with `AD1020` renders its real product photo,
  priced **R25,260.30**, with the new spacing; an unmatched line stays empty.
  `tsc --noEmit` clean.

---

## C — Website images via the pipeline (this repo)

- `scripts/apply-library-to-website.mjs` marked the 9 matched catalogue codes
  `imageStatus: "verified"` with `imagePaths` pointing at
  `/images/products/<code>.<ext>`, then regenerated with
  `npm run build:catalogue` (the manifest merge preserves the image fields).
- **9 website products gained a real image** (Adwa AD-series: `AD1020`, `AD111`,
  `AD12`, `AD130`, `AD131`, `AD132`, `AD8000`; VELP `F20100156`, `F30100182`).
- Images committed under `public/images/products/`; raw `Images/` is gitignored
  (`/Images/`, anchored to root) and the 33 MB catalogue PDF is covered by
  `*.pdf`. `tsc --noEmit` clean.

---

## D — Catalogue PDF extraction (`scripts/extract-catalogue-images.py`, GATED)

Best-effort extraction from the 312-page `CATALOGUE-2025-2028-ENG.pdf` for
products still without an image, using PyMuPDF (run via `uv run --with PyMuPDF`).

For every embedded image we found the nearest text token that is an **exact real
product code**, then scored confidence by gap distance, code shape and ambiguity.

| Metric | Count |
|--------|-------|
| PDF pages | 312 |
| Image proposals with a real code nearby | 652 |
| HIGH-confidence shortlist | 44 |
| Needs review | 608 |
| **Auto-applied** | **0** |
| No-match | the majority of catalogue images (supplier codes / decoration) — not individually wired |

**Why 0 auto-applied.** The extracted photos are genuine, but in this dense
supplier catalogue *proximity does not reliably mean ownership*: spec terms like
`PT100` recur on many pages and grab many images; multi-image/multi-code pages
misalign; some vectors are decorative line-art. Generic-word codes (`BEAKER`,
`FLASK`, `NOTE`) and bare sizes (`250`) were filtered out by requiring a
code-shaped token. Because a wrong image on a customer quote is a real error,
**nothing was auto-written** to the customer-facing repos.

**Deliverable for human approval (local, gitignored):**
- `catalogue-extract/review.html` — thumbnail contact sheet, HIGH first.
- `catalogue-extract/proposals.json` — every proposal with page, code, gap,
  candidates, confidence.
- `catalogue-extract/images/` — 652 extracted images.

To approve any match: move its image into the relevant app's public dir and add
the code to that app's lookup/manifest (the same wiring Parts B and C use).

---

## Reproduce

```bash
# Part A (run from the Labex root; needs sharp, present in this repo)
node scripts/build-image-library.mjs

# Part C (website)
node scripts/apply-library-to-website.mjs && npm run build:catalogue

# Part D (gated review only)
uv run --with PyMuPDF python scripts/extract-catalogue-images.py
```
