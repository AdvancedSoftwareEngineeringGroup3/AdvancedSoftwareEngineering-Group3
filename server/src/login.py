from pydantic import BaseModel

# May need to be changed in future with restructure of DB connection
# from supabase import create_client, Client
from passlib.context import CryptContext
import logging
from fastapi import HTTPException
from .Database_class import DataBase


# Client Side - Check if Username is cached
# If not, then prompt Login and Sign-up buttons
# Login button lets you input login details of an existing user
# Sign-up button lets you input new login details for creating a new user
# If it is cached, don't prompt with buttons

# Server Side - Two endpoints for Login and Sign-up
# Login checks for username and password in db,
# verifies the user already exists
# Sign-up checks if user does not exist, if not, add them to the database


class Login:

    def __init__(self, api, logger: logging.Logger):
        self.app = api
        self.logger = logger
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        # Load environment vars
        # load_dotenv()

        # register login route
        self.handle_login()

    def handle_login(self):
        @self.app.post("/login")
        async def login_data(login: LoginDetails):
            self.logger.info(
                f"Received login attempt: {login.username} {login.password}"
            )
            try:
                # Fetch user from DB
                user = self.get_user_data(login.username, login.password)

                if not user:
                    return {"message": f'{"Invalid username or password"}'}

                # Verify password using bcrypt
                # if not self.verify_password(
                #     login.password, user["hashed_password"]
                # ):
                #     return {"message": f'{"Invalid password"}'}

                # return success message
                return {
                    "message": f"Login successful for user: {login.username}"
                }

            except Exception as e:
                self.logger.error(f"Error processing login: {str(e)}")
                raise HTTPException(
                    status_code=500, detail="Internal server error"
                )

    def get_user_data(self, username: str, password: str):
        db = DataBase()
        db.connect_db()
        table_name = "user_table"

        # check if the user exists
        # if they don't return None
        # if they exist, get their password and return it

        if not db.search_user(table_name, username):
            self.logger.warning(f"User not found: {username}")
            db.close_con()
            return None

        if db.search_entry(table_name, username, "password") != password:
            self.logger.warning(f"Password does not match: {password}")
            db.close_con()
            return None

        self.logger.info(f"User data found: {username}, {password}")
        db.close_con()
        return password

    # def get_user_by_username(self, username: str):
    #     # Querty sb to find user by username
    #     try:
    #         response = (
    #             self.supabase.table("user_details")
    #             .select("*")
    #             .eq("username", username)
    #             .execute()
    #         )

    #         # print(f"Supabase response: {response}")

    #         data = response.data

    #         # print(f"DATA AFTER DATA=... {data}")

    #         if len(data) > 0:
    #             return data[0]
    #         else:
    #             return None
    #     except Exception as e:
    #         self.logger.error(f"Error querying Database: {str(e)}")
    #         return None

    def verify_password(
        self, plain_password: str, hashed_password: str
    ) -> bool:
        # Verifies a plain password against hashed version

        try:
            return self.pwd_context.verify(plain_password, hashed_password)
        except ValueError as e:
            self.logger.error(f"Password verification failed: {str(e)}")
            return False

    def database_query(self, username, password):
        # query database
        database_user = "Admin"
        database_pass = "abc123"
        if database_user == username:
            if database_pass == password:
                return True
            self.logger.error(
                f"{str(password)} is not a correct password\nPlease try again"
            )
            return False
        self.logger.error(
            f"{str(username)} is not a correct username\nPlease try again."
        )
        return False


class LoginDetails(BaseModel):
    username: str
    password: str
