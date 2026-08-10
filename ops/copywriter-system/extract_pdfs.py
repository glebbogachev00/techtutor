import pathlib, sys
import fitz

ADS = pathlib.Path("/Users/glebbogachev/Documents/ads")
OUT = pathlib.Path("/Users/glebbogachev/Documents/techtutor/ops/copywriter-system/raw")
OUT.mkdir(parents=True, exist_ok=True)

pdfs = sorted(ADS.glob("*.pdf"))
print(f"Found {len(pdfs)} PDFs\n")
for pdf in pdfs:
    try:
        doc = fitz.open(str(pdf))
        text = "\n\n".join(page.get_text("text") for page in doc)
        doc.close()
        outfile = OUT / f"{pdf.stem}.md"
        outfile.write_text(f"# {pdf.name}\n\n{text}", encoding="utf-8")
        print(f"  ✓ {pdf.name:55s}  {len(text):7,} chars  →  {outfile.name}")
    except Exception as e:
        print(f"  ✗ {pdf.name}: {e}")
