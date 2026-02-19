import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("NEON_DATABASE_URL")


def get_connection():
    """Get a connection to Neon Postgres database."""
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)


def create_tables():
    """Create chat_history table if it doesn't exist.
    Note: User tables are managed by better-auth server."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id SERIAL PRIMARY KEY,
                user_email VARCHAR(255) DEFAULT 'anonymous',
                message TEXT NOT NULL,
                response TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        print("✅ Chat history table ready.")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()


def save_chat(user_email, message, response):
    """Save a chat interaction to the database."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO chat_history (user_email, message, response) VALUES (%s, %s, %s)",
            (user_email, message, response)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error saving chat: {e}")
    finally:
        cur.close()
        conn.close()


def get_chat_history(user_email, limit=20):
    """Get chat history for a user."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT message, response, created_at FROM chat_history WHERE user_email = %s ORDER BY created_at DESC LIMIT %s",
            (user_email, limit)
        )
        return [dict(row) for row in cur.fetchall()]
    finally:
        cur.close()
        conn.close()
