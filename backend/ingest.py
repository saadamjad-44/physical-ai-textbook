import os
import glob
from rag_utils import get_embedding, qdrant
from qdrant_client.models import PointStruct, VectorParams, Distance

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

    # Create collection if not exists
    try:
        qdrant.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
    except Exception as e:
        print(f"Error creating collection: {e}")

    documents = read_markdown_files(DOCS_DIR)
    points = []
    
    print(f"Found {len(documents)} documents to ingest.")

    for idx, doc in enumerate(documents):
        # In a real scenario, we would chunk the content here
        # For now, we take the first 1000 chars as a simplifed chunk
        chunk = doc["content"][:1000] 
        
        try:
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
            points.append(point)
        except Exception as e:
            print(f"Error embedding document {doc['filename']}: {e}")

    if points:
        qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )
        print(f"Successfully ingested {len(points)} documents.")

if __name__ == "__main__":
    ingest_data()
