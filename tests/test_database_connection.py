import pytest
from unittest.mock import patch, MagicMock
from server.Database_class import DataBase

DB_NAME = "test_db"
DB_USER = "your_user"
DB_PASSWORD = "your_password"
DB_HOST = "localhost"
DB_PORT = "5432"

@pytest.fixture
def db():
    """Fixture to initialise and return the DataBase object"""
    return DataBase(DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT)

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
        "name": "VARCHAR(50)"
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

def test_remove_entry(db):
    """Test remove_entry method"""
    db.connection = MagicMock()
    cursor_mock = db.connection.cursor.return_value
    table_name = "test_table"
    username = "john_doe"
    
    db.remove_entry(table_name, username)
    cursor_mock.execute.assert_called_once_with(
        "DELETE FROM test_table WHERE username = 'john_doe';"
    )
    cursor_mock.close.assert_called_once()

def test_update_entry(db):
    """Test update_entry method"""
    db.connection = MagicMock()
    cursor_mock = db.connection.cursor.return_value
    table_name = "test_table"
    user = "john_doe"
    column = "password"
    data = "new_password123"
    
    db.update_entry(table_name, user, column, data)
    cursor_mock.execute.assert_called_once_with(
        "UPDATE test_table\n                SET password = 'new_password123'\n                WHERE username = 'john_doe';"
    )
    cursor_mock.close.assert_called_once()

def test_search_entry(db):
    """Test search_entry method when entry is found"""
    db.connection = MagicMock()
    cursor_mock = db.connection.cursor.return_value
    cursor_mock.fetchall.return_value = ['jason', 'keith', 'cormac']
    table_name = "test_table"
    user = "john_doe"
    column = "pending_friends"
    
    result = db.search_entry(table_name, user, column)
    cursor_mock.execute.assert_called_once_with(
        "SELECT pending_friends FROM test_table WHERE username = 'john_doe';"
    )
    cursor_mock.close.assert_called_once()
    assert result == ['jason', 'keith', 'cormac']

def test_print_table(db, capsys):
    """Test print_table method"""
    db.connection = MagicMock()
    cursor_mock = db.connection.cursor.return_value
    cursor_mock.fetchall.return_value = [("row1",), ("row2",)]
    table_name = "test_table"
    
    db.print_table(table_name)
    cursor_mock.execute.assert_called_once_with("SELECT * FROM test_table;")
    cursor_mock.close.assert_called_once()
    
    captured = capsys.readouterr()
    assert "test_table:" in captured.out
    assert "row1" in captured.out
    assert "row2" in captured.out

def test_search_user_found(db):
    """Test search_user method when user is found"""
    db.connection = MagicMock()
    cursor_mock = db.connection.cursor.return_value
    cursor_mock.fetchall.return_value = [("john_doe",)]
    table_name = "test_table"
    user = "john_doe"
    
    result = db.search_user(table_name, user)
    cursor_mock.execute.assert_called_once_with(
        "SELECT username FROM test_table WHERE username = 'john_doe';"
    )
    cursor_mock.close.assert_called_once()
    assert result is True

def test_search_user_not_found(db):
    """Test search_user method when user is not found"""
    db.connection = MagicMock()
    cursor_mock = db.connection.cursor.return_value
    cursor_mock.fetchall.return_value = []
    table_name = "test_table"
    user = "unknown_user"
    
    result = db.search_user(table_name, user)
    cursor_mock.execute.assert_called_once_with(
        "SELECT username FROM test_table WHERE username = 'unknown_user';"
    )
    cursor_mock.close.assert_called_once()
    assert result is False

def test_close_con(db):
    """Test close_con method"""
    db.connection = MagicMock()
    
    db.close_con()
    db.connection.close.assert_called_once()
