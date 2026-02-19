# Project Constitution — Physical AI & Humanoid Robotics Textbook

## Core Principles

1. **Educational Excellence**: Every chapter must teach a concept clearly, with theory, code examples, and real-world applications.

2. **AI-Native First**: The textbook leverages AI (Gemini) for personalization, translation, and Q&A — not as a gimmick, but as core pedagogy.

3. **Accessibility**: Content must be accessible to beginners while providing depth for advanced learners. Urdu translation ensures linguistic accessibility.

4. **Spec-Driven Development**: Changes follow the Spec-Kit Plus methodology — specify, plan, implement, verify.

## Development Standards

- **Frontend**: React/TypeScript with Docusaurus 3
- **Backend**: FastAPI (Python) for AI/RAG, better-auth (Node.js) for authentication
- **Database**: Neon Serverless Postgres for persistence, Qdrant Cloud for vector search
- **AI**: Google Gemini 1.5 Flash for generation and embedding
- **Deployment**: GitHub Pages (frontend), separate servers for backend services

## Quality Requirements

- Every chapter has Personalize and Translate buttons
- RAG chatbot can answer from selected text
- Authentication uses better-auth with user profiling
- Demo mode gracefully handles offline backends
