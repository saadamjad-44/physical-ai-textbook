import os
import glob
import time
from rag_utils import get_embedding, qdrant
from qdrant_client.models import PointStruct, VectorParams, Distance
from dotenv import load_dotenv

load_dotenv()

DOCS_DIR = "../physical-ai-book/docs"
COLLECTION_NAME = "textbook_content"

def read_markdown_files(directory):
    files = glob.glob(os.path.join(directory, "**/*.md"), recursive=True)
    documents = []
    for file_path in files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            documents.append({
                "path": file_path,
                "content": content,
                "filename": os.path.basename(file_path)
            })
    return documents

def ingest_data():
    if not os.getenv("QDRANT_API_KEY"):
        print("Skipping Qdrant ingestion: API Key not found.")
        return

    if not os.getenv("GEMINI_API_KEY"):
        print("Skipping ingestion: GEMINI_API_KEY not found.")
        return

    # First, get the embedding dimension from a test embedding
    print("Detecting embedding dimensions...")
    test_embedding = get_embedding("test")
    embedding_size = len(test_embedding)
    print(f"Embedding dimension: {embedding_size}")

    # Create collection
    try:
        if qdrant.collection_exists(COLLECTION_NAME):
            qdrant.delete_collection(COLLECTION_NAME)
        
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=embedding_size, distance=Distance.COSINE),
        )
        print(f"Collection '{COLLECTION_NAME}' created with size={embedding_size}.")
    except Exception as e:
        print(f"Error creating collection: {e}")
        return

    documents = read_markdown_files(DOCS_DIR)
    print(f"Found {len(documents)} documents to ingest.")

    for idx, doc in enumerate(documents):
        # Truncate very long docs to avoid API limits
        chunk = doc["content"][:2000]
        
        try:
            print(f"  [{idx+1}/{len(documents)}] Embedding {doc['filename']}...")
            embedding = get_embedding(chunk)
            
            point = PointStruct(
                id=idx,
                vector=embedding,
                payload={
                    "filename": doc["filename"],
                    "path": doc["path"],
                    "text": chunk
                }
            )
            
            # Upload one at a time to avoid timeout
            qdrant.upsert(
                collection_name=COLLECTION_NAME,
                points=[point]
            )
            print(f"  ✓ {doc['filename']} ingested successfully.")
            
            # Small delay to respect rate limits
            time.sleep(0.5)
            
        except Exception as e:
            print(f"  ✗ Error with {doc['filename']}: {e}")

    print("\n=== Ingestion Complete ===")

if __name__ == "__main__":
    ingest_data()
