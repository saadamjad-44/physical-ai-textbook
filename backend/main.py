from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import rag_utils
import db

app = FastAPI(title="Physical AI & Humanoid Robotics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup():
    try:
        db.create_tables()
    except Exception as e:
        print(f"Warning: Could not connect to Neon DB: {e}")


@app.get("/")
async def root():
    return {
        "message": "Welcome to the Physical AI & Humanoid Robotics Textbook API",
        "gemini_configured": os.getenv("GEMINI_API_KEY") is not None,
        "qdrant_configured": os.getenv("QDRANT_URL") is not None,
        "neon_configured": os.getenv("NEON_DATABASE_URL") is not None
    }


# ===== AUTH ENDPOINTS =====

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    softwareExp: str = "beginner"
    hardwareExp: str = "none"
    education: str = "undergrad"
    goals: str = ""

@app.post("/api/signup")
async def signup(request: SignupRequest):
    user = db.save_user(
        name=request.name,
        email=request.email,
        password=request.password,
        software_exp=request.softwareExp,
        hardware_exp=request.hardwareExp,
        education=request.education,
        goals=request.goals
    )
    if user is None:
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"message": "User created successfully", "user": user}


class SigninRequest(BaseModel):
    email: str
    password: str

@app.post("/api/signin")
async def signin(request: SigninRequest):
    user = db.get_user(email=request.email, password=request.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "user": user}


# ===== CHAT ENDPOINTS =====

class ChatRequest(BaseModel):
    message: str
    user_id: str = "anonymous"
    selected_text: Optional[str] = None  # For selected-text Q&A

@app.post("/chat")
async def chat(request: ChatRequest):
    if not os.getenv("GEMINI_API_KEY"):
        return {"response": f"Chat is in demo mode (Gemini not configured). You said: {request.message}"}

    try:
        # If user selected text on the page, use it as context directly
        if request.selected_text:
            answer = rag_utils.generate_answer(request.message, context_text=request.selected_text)
        else:
            # Normal RAG: search Qdrant for relevant content
            results = rag_utils.search_content(request.message)
            if not results:
                return {"response": "I couldn't find any specific information in the textbook about that. However, I can help you with general Robotics knowledge!"}
            answer = rag_utils.generate_answer(request.message, search_results=results)

        # Save chat to Neon DB
        try:
            db.save_chat(request.user_id, request.message, answer)
        except Exception:
            pass  # Don't fail the chat if DB save fails

        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/chat-history/{user_email}")
async def get_chat_history(user_email: str):
    history = db.get_chat_history(user_email)
    return {"history": history}


# ===== PERSONALIZE ENDPOINT =====

class PersonalizeRequest(BaseModel):
    content: str
    softwareExp: str = "beginner"
    hardwareExp: str = "none"
    education: str = "undergrad"
    goals: str = ""

@app.post("/personalize")
async def personalize(request: PersonalizeRequest):
    if not os.getenv("GEMINI_API_KEY"):
        return {"content": request.content, "message": "Gemini not configured"}

    try:
        prompt = f"""You are a teaching assistant for a Physical AI & Humanoid Robotics course.
Rewrite the following chapter content to be personalized for this student:
- Software experience: {request.softwareExp}
- Hardware experience: {request.hardwareExp}
- Education level: {request.education}
- Learning goals: {request.goals}

Rules:
- If the student is a beginner, add more explanations and analogies
- If the student is advanced, add more technical depth and references
- Keep the same structure (headings, code blocks)
- Make it feel personal and encouraging
- Keep the same language (English)

Original content:
{request.content[:4000]}

Rewritten personalized content:"""

        response = rag_utils.client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        return {"content": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== TRANSLATE ENDPOINT =====

class TranslateRequest(BaseModel):
    content: str
    target_language: str = "Urdu"

@app.post("/translate")
async def translate(request: TranslateRequest):
    if not os.getenv("GEMINI_API_KEY"):
        return {"content": request.content, "message": "Gemini not configured"}

    try:
        prompt = f"""Translate the following educational content about Physical AI & Robotics into {request.target_language}.

Rules:
- Translate naturally, not word-by-word
- Keep technical terms (like ROS 2, Gazebo, NVIDIA Isaac, Python, etc.) in English
- Keep code blocks unchanged
- Keep markdown formatting intact (headings, lists, bold, etc.)
- Make it easy to understand for {request.target_language} speakers

Content to translate:
{request.content[:4000]}

{request.target_language} translation:"""

        response = rag_utils.client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        return {"content": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
