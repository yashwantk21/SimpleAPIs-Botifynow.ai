# Simple AI APIs - Yashwant Harisingh Karnawat

## How it works:

## Features

- Chat with OpenAI's GPT-4o-mini model
- Upload `.pdf` or `.txt` files and extract their content
- Store file content embeddings in Qdrant using `text-embedding-3-small`
- Ask contextual questions with RAG after uploading a document
- Minimal, responsive React chat UI

## API Endpoints

### POST `/chat`

Send a basic message to OpenAI and get a response.

**Request:**
```json
{
  "message": "Hello!"
}
```

**Response:**
```json
{
  "response": "Hi there! How can I help you today?"
}
```

### POST `/upload`

Upload a `.pdf` or `.txt` document. It extracts text, chunks it, creates embeddings, and stores them in Qdrant.

**Response:**
```json
{
  "message": "Document uploaded successfully",
  "document_id": "doc_123"
}
```

### POST `/rag-chat`

Ask questions about an uploaded document.

**Request:**
```json
{
  "message": "What is the document about?",
  "document_id": "doc_123"
}
```

**Response:**
```json
{
  "response": "The document explains the product pricing structure."
}
```

## How Qdrant is Used

- Each uploaded file is split into chunks and embedded using OpenAI’s embedding model.
- Vectors are stored in Qdrant with a `document_id`.
- On RAG chat, the system searches for similar vectors in Qdrant using the `document_id`.
- Top matches are included as context to OpenAI’s chat model to generate a document-aware answer.

## Error Handling

- Only `.pdf` and `.txt` files are accepted
- Invalid file types return:
```json
{
  "detail": "Unsupported file type"
}
```
- Upload failures return:
```json
{
  "error": "Upload failed"
}
```
- OpenAI or vector errors are caught and a generic fallback response is sent.

## Tech Stack

- **Frontend**: React
- **Backend**: FastAPI
- **Embedding & LLM**: OpenAI (GPT-4o-mini, text-embedding-3-small)
- **Vector DB**: Qdrant

## Setup Instructions

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

