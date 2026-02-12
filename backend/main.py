from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import rag_utils

app = FastAPI(title="Physical AI & Humanoid Robotics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Physical AI & Humanoid Robotics Textbook API",
        "gemini_configured": os.getenv("GEMINI_API_KEY") is not None,
        "qdrant_configured": os.getenv("QDRANT_URL") is not None
    }

class ChatRequest(BaseModel):
    message: str
    user_id: str = "anonymous"

@app.post("/chat")
async def chat(request: ChatRequest):
    if not os.getenv("GEMINI_API_KEY"):
        return {"response": f"Chat is in demo mode (Gemini not configured). You said: {request.message}"}
    
    try:
        results = rag_utils.search_content(request.message)
        if not results:
             return {"response": "I couldn't find any specific information in the textbook about that. However, I can help you with general Robotics knowledge!"}
             
        answer = rag_utils.generate_answer(request.message, results)
        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
