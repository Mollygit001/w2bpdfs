import fitz  # PyMuPDF
from io import BytesIO

def convert_pdf_to_dark_mode(file_bytes: bytes) -> bytes:
    doc = fitz.open(stream=file_bytes, filetype="pdf")

    for page in doc:
        rect = page.rect
        page.draw_rect(rect, color=(0, 0, 0), fill=(0, 0, 0), overlay=False)

        text = page.get_text("dict")
        for block in text["blocks"]:
            for line in block.get("lines", []):
                for span in line.get("spans", []):
                    try:
                        page.insert_text(
                            (span["bbox"][0], span["bbox"][1]),
                            span["text"],
                            fontsize=span["size"],
                            color=(1, 1, 1),  # white
                            fontname=span["font"],  # try original font
                        )
                    except:
                        try:
                            # fallback to a default font if original fails
                            page.insert_text(
                                (span["bbox"][0], span["bbox"][1]),
                                span["text"],
                                fontsize=span["size"],
                                color=(1, 1, 1),
                                fontname="helv",
                            )
                        except:
                            pass  # skip if it still fails

    output = BytesIO()
    doc.save(output)
    doc.close()
    return output.getvalue()
