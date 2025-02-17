import pytest
from unittest.mock import patch, MagicMock
from server.Database_class import DataBase

# # Processing a friend request - sent 

# # Processing a friend request - friend acceptance
# # Handling a message request between two clients
# # Source username to IP lookup in db, sending to destination username using IP lookup in db

# import pytest
# import psycopg2

# DB_NAME = "test_db"
# DB_USER = "your_user"
# DB_PASSWORD = "your_password"
# DB_HOST = "localhost"
# DB_PORT = "5432"

# @pytest.fixture(scope="session")
# def setup_db():
#     """Fixture to create and destroy a temporary PostgreSQL test database."""
#     # Connect to the default database
#     conn = psycopg2.connect(
#         dbname="postgres",
#         user=DB_USER,
#         password=DB_PASSWORD,
#         host=DB_HOST,
#         port=DB_PORT
#     )
#     conn.autocommit = True
#     cursor = conn.cursor()
    
#     # Create test database
#     cursor.execute(f"CREATE DATABASE {DB_NAME};")
#     yield  # Tests run here
    
#     # Drop test database after tests
#     cursor.execute(f"DROP DATABASE {DB_NAME};")
#     cursor.close()
#     conn.close()

# @pytest.fixture
# def db_conn(setup_db):
#     """Fixture to connect to the test database."""
#     conn = psycopg2.connect(
#         dbname=DB_NAME,
#         user=DB_USER,
#         password=DB_PASSWORD,
#         host=DB_HOST,
#         port=DB_PORT
#     )
#     yield conn
#     conn.close()

# def test_insert_and_query(db_conn):
#     """Example test that inserts and queries data."""
#     cursor = db_conn.cursor()
#     cursor.execute("""
#         CREATE TABLE users (
#             id SERIAL PRIMARY KEY,
#             username VARCHAR(50) NOT NULL
#         );
#     """)
#     cursor.execute("INSERT INTO users (username) VALUES ('john_doe');")
#     cursor.execute("SELECT username FROM users WHERE username = 'john_doe';")
#     result = cursor.fetchone()
#     assert result[0] == 'john_doe'
#     cursor.close()



# def test_sent_friend_request_db(db_conn):
#     # Sender User, Receiver User
#     friend_request = ReceiveFriendRequest()

#     sender = friend_request[0]
#     receiver = friend_request[1]

#     cursor = db_conn.cursor()
#     cursor.execute(f"SELECT pending FROM users WHERE username = '{receiver}'")

#     cursor.execute(f"""UPDATE {table_name}
#                 SET {column} = '{data}'
#                 WHERE username = '{user}';INSERT INTO users (pending_requests) VALUES ('{sender}') WHERE username = {receiver};""")

#     cursor.close()
    

