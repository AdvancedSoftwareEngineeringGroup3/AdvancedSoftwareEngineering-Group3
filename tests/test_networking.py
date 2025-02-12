import pytest
from unittest.mock import patch, MagicMock
from server.Database_class import DataBase

@pytest.fixture
def db():
    """Fixture to initialise and return the DataBase object"""
    return DataBase()

@patch("server.Database_class.pg8000.connect")
def test_connect_db(mock_connect, db):
    """Test database connection"""
    mock_connect.return_value = MagicMock()
    db.connect_db()
    mock_connect.assert_called_once_with(
        host=db.DB_HOST,
        database=db.DB_NAME,
        user=db.DB_USER,
        password=db.DB_PASSWORD,
        port=db.DB_PORT
    )
    assert db.connection is not None

def test_create_table(db):
    """Test create_table method"""
    db.connection = MagicMock()
    cursor_mock = db.connection.cursor.return_value
    table_name = "test_table"
    table_info = {
        "id": "SERIAL PRIMARY KEY",
        "username": "VARCHAR(50)",
        "friends": "VARCHAR(50)",
        "pending friends": "VARCHAR(50)"
    }
    
    db.create_table(table_name, table_info)
    cursor_mock.execute.assert_called_once_with(
        "CREATE TABLE test_table (id SERIAL PRIMARY KEY,name VARCHAR(50));"
    )
    cursor_mock.close.assert_called_once()

def test_add_entry(db):
    """Test add_entry method"""
    db.connection = MagicMock()
    cursor_mock = db.connection.cursor.return_value
    table_name = "test_table"
    table_data = {
        "username": "john_doe",
        "password": "password123"
    }
    
    db.add_entry(table_name, table_data)
    cursor_mock.execute.assert_called_once_with(
        "INSERT INTO test_table (username,password) VALUES ('john_doe','password123');"
    )
    cursor_mock.close.assert_called_once()