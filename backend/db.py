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
    """Create users and chat_history tables if they don't exist."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                software_exp VARCHAR(50) DEFAULT 'beginner',
                hardware_exp VARCHAR(50) DEFAULT 'none',
                education VARCHAR(50) DEFAULT 'undergrad',
                goals TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
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
        print("✅ Database tables created successfully.")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()


def save_user(name, email, password, software_exp, hardware_exp, education, goals):
    """Save a new user to the database."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """INSERT INTO users (name, email, password, software_exp, hardware_exp, education, goals)
               VALUES (%s, %s, %s, %s, %s, %s, %s)
               RETURNING id, name, email, software_exp, hardware_exp, education, goals""",
            (name, email, password, software_exp, hardware_exp, education, goals)
        )
        user = cur.fetchone()
        conn.commit()
        return dict(user)
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return None  # Email already exists
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()


def get_user(email, password=None):
    """Get a user by email.  If password is provided, check credentials."""
    conn = get_connection()
    cur = conn.cursor()
    try:
        if password:
            cur.execute(
                "SELECT id, name, email, software_exp, hardware_exp, education, goals FROM users WHERE email = %s AND password = %s",
                (email, password)
            )
        else:
            cur.execute(
                "SELECT id, name, email, software_exp, hardware_exp, education, goals FROM users WHERE email = %s",
                (email,)
            )
        user = cur.fetchone()
        return dict(user) if user else None
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
