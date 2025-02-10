import pytest
import pg8000
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

@pytest.fixture
def db_credentials(monkeypatch):
    """Mock database environment variables."""
    monkeypatch.setenv("DB_HOST", "localhost")  # Change to your actual test DB host
    monkeypatch.setenv("DB_NAME", "test_db")
    monkeypatch.setenv("DB_USER", "test_user")
    monkeypatch.setenv("DB_PASSWORD", "test_password")
    monkeypatch.setenv("DB_PORT", "5432")

def test_db_connection(db_credentials):
    """Test database connection."""
    DB_HOST = os.getenv("DB_HOST")
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_PORT = int(os.getenv("DB_PORT"))

    connection = None
    try:
        connection = pg8000.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT
        )
        assert connection is not None, "Connection failed"
        assert connection.client_encoding is not None, "Invalid connection encoding"
    except Exception as e:
        pytest.fail(f"Database connection failed with error: {e}")
    finally:
        if connection:
            connection.close()
            assert connection is not None, "Connection should not be None"
