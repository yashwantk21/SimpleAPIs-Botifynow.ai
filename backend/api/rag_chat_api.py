from fastapi import APIRouter, HTTPException
from core.config import client
from core.qdrant import search_similar_documents
from models.schemas import RagRequest

rag_router = APIRouter()

@rag_router.post("/")
async def rag_chat(request: RagRequest):
    try:
        query_embedding = client.embeddings.create(
            input=request.message,
            model="text-embedding-3-small"
        ).data[0].embedding

        hits = search_similar_documents(query_embedding, request.document_id)

        context = "\n".join([hit.payload["text"] for hit in hits])

        prompt = f"Use the following document info to answer:\n{context}\n\nQ: {request.message}\nA:"

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        return {"response": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
