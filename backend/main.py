from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.chat_api import chat_router
from api.upload_api import upload_router
from api.rag_chat_api import rag_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/chat")
app.include_router(upload_router, prefix="/upload")
app.include_router(rag_router, prefix="/rag-chat")   