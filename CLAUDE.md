# Claude Code Project Context: Physical AI Textbook

## Project Overview
This project is an AI-native textbook and RAG chatbot for a course on Physical AI and Humanoid Robotics.

## Tech Stack
- **Frontend**: Docusaurus 3 (React/TS)
- **Backend**: FastAPI (Python)
- **Database**: Neon Serverless Postgres (Persistence)
- **Vector DB**: Qdrant Cloud (RAG)
- **AI Engine**: Google Gemini 1.5 Flash

## Coding Standards
- Use functional React components with TypeScript.
- Backend logic should reside in `rag_utils.py` and `db.py`.
- Keep API endpoints in `main.py`.
- Use `@site` aliases for Docusaurus imports.

## Agent Skills
- `PersonalizeContent`: Adapt textbook content based on user profile.
- `TranslateToUrdu`: Provide native Urdu translations for chapters.
- `RAGAssistant`: Answer technical questions using textbook context.
