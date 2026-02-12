import os
from google import genai
from qdrant_client import QdrantClient
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini Client (New SDK)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize Qdrant
qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

def get_embedding(text):
    """Generate embeddings using Gemini's stable embedding model."""
    response = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=text
    )
    return response.embeddings[0].values

def search_content(query, limit=3):
    """Search for relevant content in Qdrant."""
    query_vector = get_embedding(query)
    
    search_result = qdrant.query_points(
        collection_name="textbook_content",
        query=query_vector,
        limit=limit
    ).points
    return search_result

def generate_answer(query, context_chunks):
    """Generate a response using Gemini 1.5 Flash with textbook context."""
    context_text = "\n\n".join([c.payload['text'] for c in context_chunks])
    
    prompt = f"""
    You are a Physical AI and Robotics expert assistant. 
    Use the following textbook context to answer the user's question accurately.
    If the answer is not in the context, use your general knowledge but mention it's not in the specific chapter.

    Context:
    {context_text}

    User Question: {query}
    
    Answer (be helpful and professional):
    """
    
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt
    )
    return response.text
