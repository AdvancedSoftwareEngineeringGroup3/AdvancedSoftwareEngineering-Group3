import pg8000
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()


class DataBase:
    def __init__(
        self,
        host=os.getenv("DB_HOST"),
        name=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=int(os.getenv("DB_PORT")),
    ):
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

            print(query)
            cursor.execute(query)
            cursor.close()

        except Exception as e:
            self.connection.rollback()
            print("An error occurred:", e)


        # cursor = self.connection.cursor()
        # data = cursor.execute("SELECT * FROM information_schema.tables")
        # data = cursor.fetchall()
        # print(data)

    def add_entry(self, table_name: str, table_data: dict[str, str]) -> None:
        """Add row to database with new entry


        Args:
            table name (str): name of table to be queried
            table data (str, str): keys are columns, values are user data
        """
        try:
            cursor = self.connection.cursor()

            query = f"""INSERT INTO {table_name} ("""

            # Insert column names
            for key in table_data.keys():
                query += f"""{key},"""

            query = query[0:-1]
            query += ") VALUES ("

            # Insert entry values for each column
            for value in table_data.values():
                if "ARRAY" in value:
                    query += f"""{value},"""
                else:
                    query += f"""'{value}',"""
            query = query[0:-1]
            query += ");"

            cursor.execute(query)
        except Exception as e:
            self.connection.rollback()
            print("An error occurred:", e)
        finally:
            cursor.close()

    def remove_entry(self, table_name: str, username: str) -> None:
        """Remove entry (entire row) from table

        Args:
            table_name (str): name of table to be queried
            username (str): username given as identifier in table
        """
        try:
            cursor = self.connection.cursor()
            query = f"DELETE FROM {table_name} WHERE username = '{username}';"
            cursor.execute(query)
        except Exception as e:
            self.connection.rollback()
            print("An error occurred:", e)
        finally:
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
        try:
            cursor = self.connection.cursor()

            # TODO: check if username needs to be made dynamic
            query = f"UPDATE {table_name} "
            f"SET {column} = '{data}' "
            f"WHERE username = '{user}';"

            cursor.execute(query)
        except Exception as e:
            self.connection.rollback()
            print("An error occurred:", e)
        finally:
            cursor.close()

    def search_entry(self, table_name: str, user: str, column: str):
        """Search for entry in Table Cell

        Args:
            table_name (str): Name of table to be queried
            user (str): selected user
            column (str): column needed
        """
        try:
            records = None
            cursor = self.connection.cursor()

            query = f"""SELECT {column}
            FROM {table_name}
            WHERE username = '{user}';"""

            cursor.execute(query)
            records = cursor.fetchall()

            if type(records) is tuple:
                records = records[0][0]

            # commit needed to cement transaction in database
            self.connection.commit()
        except Exception as e:
            print("An error occurred:", e)
            self.connection.rollback()
        finally:
            cursor.close()
            return records

    # maybe update "sender" to be more general data to append
    def append_entry(
        self, table_name: str, sender: str, receiver: str, column: str
    ) -> None:
        """Append value to an array entry in Table Cell

        Args:
            table_name (str): Name of table to be queried
            sender (str): user sending request
            receiver (str): user receiving request
            column (str): column needed - must be an array column
        """
        try:
            cursor = self.connection.cursor()
            query = f"UPDATE {table_name} "
            f"SET {column} = array_append({column},'{sender}') "
            f"WHERE username = '{receiver}';"
            cursor.execute(query)
            self.connection.commit()
        except Exception as e:
            print(
                "An error occurred: "
                "Cannot append to non-array column in database"
            )
            print("An error occurred:", e)
            self.connection.rollback()
        finally:
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
            print(f"{tablename}:")
            for record in records:
                print(record)

        except Exception as e:
            print("An error occurred:", e)
            self.connection.rollback()
        finally:
            cursor.close()

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
                f"SELECT username FROM {table_name} "
                f"WHERE username = '{user}';"
            )
            cursor.execute(query)
            record = list(cursor.fetchall())

            if record:
                return True
            return False
        except Exception as e:
            print("An error occurred:", e)
            self.connection.rollback()
        finally:
            cursor.close()


def main():
    # Initialise database class
    db = DataBase()

    table_name = "testing_table"
    table_info = {
        "id": "SERIAL PRIMARY KEY",
        "username": "VARCHAR(50)",
        "password": "VARCHAR(50)",
        "friends_list": "VARCHAR[]",
        "pending_friends": "VARCHAR[]",
        "sus_score": "VARCHAR(50)",
        "ip": "VARCHAR(50)",
    }

    table_data = {
        "username": "Conor",
        "password": "abc123",
        "friends_list": "ARRAY['mark', 'gunjan', 'fiona']",
        "pending_friends": "ARRAY['cormac', 'jason']",
        "sus_score": "100",
    }

    # Connect to db
    db.connect_db()
    db.create_table(table_name, table_info)
    db.add_entry(table_name, table_data)

    result = db.search_entry(table_name, "Conor", "pending_friends")
    print(result)

    db.append_entry(table_name, "keith", "Conor", "pending_friends")
    db.append_entry(table_name, "siobhan", "Conor", "pending_friends")
    
    result = db.search_entry(table_name, "Conor", "pending_friends")
    print(result)

    # db.add_entry(table_name, {"username": "Keith",
    # "password": "strong password"})
    # db.remove_entry(table_name, 'Conor')
    # db.update_entry(table_name, 'Keith', 'password', 'Roots123')
    # db.print_table(table_name)
    # print(db.search_user(table_name, 'Conor'))
    db.close_con()


if __name__ == "__main__":
    main()
