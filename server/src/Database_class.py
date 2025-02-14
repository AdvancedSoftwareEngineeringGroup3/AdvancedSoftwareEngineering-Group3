# connect_to_db.py

import pg8000
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()


class DataBase:
    def __init__(self):
        # Database connection details
        self.DB_HOST = os.getenv("DB_HOST")
        self.DB_NAME = os.getenv("DB_NAME")
        self.DB_USER = os.getenv("DB_USER")
        self.DB_PASSWORD = os.getenv("DB_PASSWORD")
        self.DB_PORT = int(os.getenv("DB_PORT"))
        self.connection = None

    def connect_db(self) -> None:
        """Initialise database connection"""
        try:
            # Connect to the database
            self.connection = pg8000.connect(
                host=self.DB_HOST,
                database=self.DB_NAME,
                user=self.DB_USER,
                password=self.DB_PASSWORD,
                port=self.DB_PORT,
            )
            print("Connection successful!")

        except Exception as e:
            print("An error occurred:", e)

    def create_table(
        self, table_name: str, table_info: dict[str, str]
    ) -> None:
        """Creates table in database

        Args:
            table name (str): name of table to be queried
            table info (dict[str, str]): dict containing columns
            as keys and data type as column type
        """
        try:
            cursor = self.connection.cursor()
            query = f"""CREATE TABLE {table_name} ("""

            for key in table_info.keys():
                query += f"{key} {table_info[key]},"
            query = query[0:-1]
            query += ");"
            cursor.execute(query)
            cursor.close()

        except Exception as e:
            print("An error occurred:", e)

    def add_entry(self, table_name: str, table_data: dict[str, str]) -> None:
        """Add row to database with new entry

        Args:
            table name (str): name of table to be queried
            table data (str, str): keys are columns, values are user data
        """
        cursor = self.connection.cursor()

        query = f"""INSERT INTO {table_name} ("""

        # Insert column names
        for key in table_data.keys():
            query += f"""{key},"""

        query = query[0:-1]
        query += ") VALUES ("

        # Insert entry values for each column
        for value in table_data.values():
            query += f"""'{value}',"""
        query = query[0:-1]
        query += ");"

        cursor.execute(query)
        cursor.close()

    def remove_entry(self, table_name: str, username: str) -> None:
        """Remove entry (entire row) from table

        Args:
            table_name (str): name of table to be queried
            username (str): username given as identifier in table
        """
        cursor = self.connection.cursor()
        query = f"DELETE FROM {table_name} WHERE username = '{username}';"
        cursor.execute(query)
        cursor.close()

    def update_entry(
        self, table_name: str, user: str, column: str, data: str
    ) -> None:
        """Update entry of specific column

        Args:
            table_name (str): name of table to be queried
            user (str): username given as identifier in table
            column (str): column to be edited in table
            data (str): data to be inserted in new column entry
        """
        cursor = self.connection.cursor()

        # TODO: check if username needs to be made dynamic
        query = f"""UPDATE {table_name}
                SET {column} = '{data}'
                WHERE username = '{user}';"""

        cursor.execute(query)
        cursor.close()

    def print_table(self, tablename: str):
        """Prints current selected table

        Args:
            tablename (str): Name of table to be printed
        """
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
        """Close the connection"""
        self.connection.close()

    def search_user(self, table_name: str, user: str) -> bool:
        """Search for user in database

        Args:
            table_name (str): Name of table to be queried
            user (str): Name of user to search

        Returns:
            bool: True if user found, False if user not found in table
        """
        try:
            cursor = self.connection.cursor()

            query = (
                f"SELECT username FROM {table_name} WHERE username = '{user}';"
            )
            cursor.execute(query)
            record = list(cursor.fetchall())
            cursor.close()

            if record:
                return True
            return False
        except Exception as e:
            print("An error occurred: ", e)


def main():
    # Initiliase database class
    db = DataBase()
    table_info = {
        "id": "SERIAL PRIMARY KEY",
        "username": "VARCHAR(50)",
        "password": "VARCHAR(50)",
    }
    table_data = {"username": "Conor", "password": "abc123"}
    table_name = "testTable"

    # Connect to db
    db.connect_db()
    db.create_table(table_name, table_info)
    db.add_entry(table_name, table_data)
    db.add_entry(
        table_name, {"username": "Keith", "password": "strong password"}
    )
    # db.remove_entry(table_name, 'Conor')
    db.update_entry(table_name, "Keith", "password", "Roots123")
    db.print_table(table_name)
    print(db.search_user(table_name, "Conor"))
    db.close_con()


if __name__ == "__main__":
    main()
