# connect_to_db.py

import pg8000
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class DataBase():
    def __init__(self):
        # Database connection details
        self.DB_HOST = os.getenv("DB_HOST")
        self.DB_NAME = os.getenv("DB_NAME")
        self.DB_USER = os.getenv("DB_USER")
        self.DB_PASSWORD = os.getenv("DB_PASSWORD")
        self.DB_PORT = int(os.getenv("DB_PORT"))

    def connect_db(self):
        try:
            # Connect to the database
            self.connection = pg8000.connect(
                host=self.DB_HOST,
                database=self.DB_NAME,
                user=self.DB_USER,
                password=self.DB_PASSWORD,
                port=self.DB_PORT
            )
            print("Connection successful!")

        except Exception as e:
            print("An error occurred:", e)
    
    def query_db(self):
        # # Add to database
        # query = """UPDATE contacts
        #         SET first_name = 'Keith'
        #         WHERE first_name = 'Alice'"""
        # cursor.execute(query)

        # Query the database
        cursor = self.connection.cursor()
        query = "SELECT * FROM contacts;"
        cursor.execute(query)
        records = cursor.fetchall()

        # Print the results
        print("Contacts:")
        for record in records:
            print(record)
        
        # Close the cursor
        cursor.close()


    def close_con(self):
        # Close the connection
        self.connection.close()

def main():
    # Initiliase database class
    db = DataBase()

    # Connect to db
    db.connect_db()
    db.query_db()
    db.close_con()

if __name__ == "__main__":
    main()