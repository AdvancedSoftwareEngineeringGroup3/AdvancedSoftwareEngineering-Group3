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
        self.connection = None

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


    def create_table(self, table_name: str, table_info: dict) -> None:
        try:
            cursor = self.connection.cursor()
            query =  f"""CREATE TABLE {table_name} ("""

            for key in table_info.keys():
                query += f"{key} {table_info[key]},"
            query = query[0:-1]
            query += ");"
            cursor.execute(query)
            cursor.close()

        #print(query)
        except Exception as e:
           print("An error occurred:", e)

    def add_entry(self, table_name, table_info, table_data):

        cursor = self.connection.cursor()

        query =  f"""INSERT INTO {table_name} ("""
        #TODO: Add check for lenght of data and table info dict.values

        for key in table_info.keys():
            query += f"""{key},"""
            query = query[0:-1]
            query += ") "

        query += """VALUES ("""

        for key in table:
            query += f"""{key},"""
            query = query[0:-1]
            query += ") "


            cursor.execute(query)
            cursor.close()


        query = f""" {f} (first_name, second_name)
                VALUES ('Keith', 'Ahern')"""
        
        cursor.execute(query)

        query = "SELECT * FROM name;"
        cursor.execute(query)
        records = cursor.fetchall()

        # Print the results
        print("name:")
        for record in records:
            print(record)
        cursor.close()
            

    def query_db(self, tablename):

        try:
            cursor = self.connection.cursor()
            query = f"SELECT * FROM {tablename};"
            cursor.execute(query)
            records = cursor.fetchall()

            # Print the results
            print("Contacts:")
            for record in records:
                print(record)
            
            # Close the cursor
            cursor.close()
        except Exception as e:
           print("An error occurred:", e)


    def close_con(self):
        # Close the connection
        self.connection.close()

def main():
    # Initiliase database class
    db = DataBase()
    table_info = {"id": "SERIAL PRIMARY KEY",
                "first_name": "VARCHAR(50)",
                "second_name": "VARCHAR(50)"}
    table_name = "testTable"
    # Connect to db
    db.connect_db()
    db.create_table(table_name, table_info)
    db.query_db(table_name)
    db.close_con()

if __name__ == "__main__":
    main()