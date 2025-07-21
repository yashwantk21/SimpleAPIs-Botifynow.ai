from uuid import uuid4
from qdrant_client import QdrantClient
from qdrant_client.models import (
    PointStruct, Filter, FieldCondition, MatchValue
)
from typing import List
from .config import qdrant, COLLECTION_NAME

def upload_text_chunks(chunks: List[str], embeddings: List, document_id: str):
    points = [
        PointStruct(
            id=int(uuid4().int % 1e9),
            vector=embedding.embedding,
            payload={"text": chunk, "document_id": document_id}
        )
        for chunk, embedding in zip(chunks, embeddings)
    ]
    qdrant.upload_points(collection_name=COLLECTION_NAME, points=points)

def search_similar_documents(query_embedding: List[float], document_id: str, limit: int = 3):
    return qdrant.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_embedding,
        limit=limit,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="document_id",
                    match=MatchValue(value=document_id)
                )
            ]
        )
    )
