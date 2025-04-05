from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dark_mode import convert_pdf_to_dark_mode
from io import BytesIO

app = FastAPI()

# CORS config to allow frontend access (especially from localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/convert")
async def convert(file: UploadFile = File(...)):
    contents = await file.read()

    try:
        # Convert PDF to dark mode
        converted_bytes = convert_pdf_to_dark_mode(contents)

        # Send the converted PDF back
        return StreamingResponse(
            BytesIO(converted_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=dark_{file.filename}"}
        )
    except Exception as e:
        return {"error": str(e)}
