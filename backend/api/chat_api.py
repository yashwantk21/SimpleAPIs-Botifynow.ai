from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest
from core.config import client

chat_router = APIRouter()

@chat_router.post("/")
async def chat(request: ChatRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": request.message}]
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
