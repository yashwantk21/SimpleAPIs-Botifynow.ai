from fastapi import APIRouter, UploadFile, File, HTTPException
from core.config import client
from core.qdrant import upload_text_chunks
from uuid import uuid4
import os
import pdfplumber

upload_router = APIRouter()

@upload_router.post("/")
async def upload(file: UploadFile = File(...)):
    contents = ""

    if file.filename.endswith(".pdf"):
        with open("temp.pdf", "wb") as f:
            f.write(await file.read())
        with pdfplumber.open("temp.pdf") as pdf:
            for page in pdf.pages:
                contents += page.extract_text() or ""
        os.remove("temp.pdf")

    elif file.filename.endswith(".txt"):
        contents = (await file.read()).decode("utf-8")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    chunks = [contents[i:i+500] for i in range(0, len(contents), 500)]

    embeddings = client.embeddings.create(input=chunks, model="text-embedding-3-small")

    doc_id = str(uuid4())
    upload_text_chunks(chunks, embeddings.data, doc_id)

    return {"message": "Document uploaded successfully", "document_id": doc_id}
