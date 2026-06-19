"""
PART D — best-effort, GATED extraction of product images from the 312-page
catalogue PDF, for codes that still have no image after Part A.

For every embedded image we find the nearest text token that is an EXACT real
product code (validated against the catalogue + price-list). Confidence:

  HIGH   — exactly one real code sits immediately next to the image (small gap),
           and that code has no image yet. Auto-applied ONLY with --apply.
  REVIEW — a real code is nearby but ambiguous / further away / already imaged.
  (images with no real code nearby are skipped entirely)

Outputs (catalogue-extract/):
  images/        extracted embedded images (one per occurrence we propose)
  proposals.json structured proposals with page, code, gap, confidence
  review.html    thumbnail contact sheet for a human to approve

Never guesses: a token only counts if it is an exact real code.
Run:  uv run --with PyMuPDF python scripts/extract-catalogue-images.py [--apply]
"""
import sys, re, json, html
from pathlib import Path
import fitz

ROOT = Path.cwd()
PDF = ROOT / "CATALOGUE-2025-2028-ENG.pdf"
OUT = ROOT / "catalogue-extract"
IMG_OUT = OUT / "images"
# Review-only by design: in this dense supplier catalogue, "a real code printed
# near an image" does NOT reliably mean it is THAT product's image (spec terms
# like PT100 recur on many pages; multi-image/multi-code pages misalign; some
# vectors are decorative line-art). A wrong image on a customer quote is a real
# error, so NOTHING is auto-applied — every proposal goes to the review sheet.

OUT.mkdir(exist_ok=True)
IMG_OUT.mkdir(exist_ok=True)

def load_codes(fname):
    m = {}
    with open(ROOT / fname, encoding="utf-8", errors="ignore") as f:
        next(f, None)
        for line in f:
            c = line.split(",")[0].strip()
            if c:
                m[c.lower()] = c
    return m

cat = load_codes("labex-real-catalogue.csv")
pl = load_codes("ItemExport.csv")
real = {**pl, **cat}  # canonical real codes (case-insensitive)

# Codes already imaged in Part A (don't propose those again).
have = set()
lib = json.loads((ROOT / "image-library-manifest.json").read_text(encoding="utf-8"))
for p in lib["products"]:
    if p["match"] != "unmatched":
        have.add(p["code"].lower())

CODE_RE = re.compile(r"[A-Z0-9][A-Z0-9\-\./]{2,}")
MIN_DIM = 60          # ignore icons/logos (points)
NEAR = 12             # "directly next to" gap in points for HIGH confidence

def code_shaped(tok):
    """Reject generic English words (BEAKER, FLASK, NOTE) and bare sizes (250,
    1000) that coincidentally equal a real code. A genuine product code carries a
    digit; pure-numeric codes must be a 6+ digit internal SKU (not a volume)."""
    if not any(c.isdigit() for c in tok):
        return False
    if tok.isdigit():
        return len(tok) >= 6
    return len(tok) >= 4

doc = fitz.open(PDF)
proposals = []
seen_xref_code = set()

for pno in range(len(doc)):
    page = doc[pno]
    words = page.get_text("words")  # [x0,y0,x1,y1,word,block,line,wn]
    # pre-extract real-code tokens with their boxes
    code_tokens = []
    for x0, y0, x1, y1, w, *_ in words:
        for tok in CODE_RE.findall(w.upper()):
            if tok.lower() in real and code_shaped(tok):
                code_tokens.append((x0, y0, x1, y1, real[tok.lower()]))
    if not code_tokens:
        continue
    for img in page.get_images(full=True):
        xref = img[0]
        try:
            rects = page.get_image_rects(xref)
        except Exception:
            rects = []
        for rect in rects:
            if rect.width < MIN_DIM or rect.height < MIN_DIM:
                continue
            # gap from image rect to each code token (0 if overlapping)
            scored = []
            for (x0, y0, x1, y1, code) in code_tokens:
                dx = max(rect.x0 - x1, x0 - rect.x1, 0)
                dy = max(rect.y0 - y1, y0 - rect.y1, 0)
                scored.append(((dx * dx + dy * dy) ** 0.5, code))
            scored.sort()
            nearest_gap, nearest_code = scored[0]
            distinct = sorted({c for _, c in scored})
            # second-nearest DIFFERENT code gap (ambiguity check)
            second_gap = next((g for g, c in scored if c != nearest_code), 1e9)

            if nearest_gap > 220:   # no code reasonably near this image
                continue
            already = nearest_code.lower() in have
            unambiguous = (second_gap - nearest_gap) > NEAR or len(distinct) == 1
            high = (nearest_gap <= NEAR) and unambiguous and not already
            confidence = "HIGH" if high else "REVIEW"

            key = (xref, nearest_code)
            if key in seen_xref_code:
                continue
            seen_xref_code.add(key)

            # extract the embedded image bytes
            try:
                ext_img = doc.extract_image(xref)
            except Exception:
                continue
            ext = ext_img["ext"]
            fname = f"p{pno+1:03d}_x{xref}_{nearest_code.replace('/', '_')}.{ext}"
            (IMG_OUT / fname).write_bytes(ext_img["image"])

            proposals.append({
                "page": pno + 1,
                "xref": xref,
                "code": nearest_code,
                "gap": round(nearest_gap, 1),
                "second_gap": round(second_gap, 1) if second_gap < 1e9 else None,
                "candidates": distinct[:5],
                "already_imaged": already,
                "confidence": confidence,
                "image": f"images/{fname}",
                "w": round(rect.width), "h": round(rect.height),
            })

# Flag HIGH codes that grab more than one image — ambiguous even at small gap.
from collections import Counter
code_img_count = Counter(p["code"] for p in proposals if p["confidence"] == "HIGH")
for p in proposals:
    if p["confidence"] == "HIGH" and code_img_count[p["code"]] > 1:
        p["confidence"] = "REVIEW"
        p["note"] = "code matched multiple images — ambiguous"

high = [p for p in proposals if p["confidence"] == "HIGH"]
review = [p for p in proposals if p["confidence"] == "REVIEW"]
(OUT / "proposals.json").write_text(json.dumps({
    "generated": __import__("datetime").date.today().isoformat(),
    "pdf_pages": len(doc),
    "total_proposals": len(proposals),
    "high_confidence": len(high),
    "needs_review": len(review),
    "proposals": proposals,
}, indent=2), encoding="utf-8")

# Contact sheet
rows = []
for p in sorted(proposals, key=lambda x: (x["confidence"] != "HIGH", x["gap"])):
    badge = "#1a7f37" if p["confidence"] == "HIGH" else "#9a6700"
    rows.append(f'''<div style="display:inline-block;width:210px;margin:6px;padding:8px;border:1px solid #ddd;border-radius:6px;vertical-align:top;font:12px sans-serif">
<img src="{html.escape(p["image"])}" style="width:194px;height:150px;object-fit:contain;background:#faf7f3"/>
<div style="margin-top:6px"><b>{html.escape(p["code"])}</b> <span style="color:{badge}">{p["confidence"]}</span></div>
<div style="color:#666">p{p["page"]} · gap {p["gap"]}pt · {p["w"]}×{p["h"]}{" · already imaged" if p["already_imaged"] else ""}</div>
<div style="color:#999;font-size:11px">near: {html.escape(", ".join(p["candidates"]))}</div></div>''')
(OUT / "review.html").write_text(
    f"<h2>Catalogue image extraction — review</h2><p>{len(proposals)} proposals · "
    f"{len(high)} HIGH · {len(review)} REVIEW. Approve by moving images to an app's "
    f"public dir + adding the code to its lookup/manifest.</p>" + "".join(rows),
    encoding="utf-8")

print(f"PDF pages              : {len(doc)}")
print(f"Proposals (code nearby): {len(proposals)}")
print(f"  HIGH confidence      : {len(high)}")
print(f"  needs REVIEW         : {len(review)}")
print(f"Extracted images dir   : {IMG_OUT}")
print(f"Review sheet           : {OUT/'review.html'}")
print(f"  (HIGH = single unambiguous code-shaped match directly next to a real")
print(f"   product photo — a prioritised shortlist for a human, NOT auto-applied)")
print(f"\nAUTO-APPLIED: 0 (gated -- code/image alignment not verifiable enough for")
print(f"             customer-facing quotes; approve from {OUT/'review.html'})")
