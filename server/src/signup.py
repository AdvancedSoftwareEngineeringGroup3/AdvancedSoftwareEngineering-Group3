from pydantic import BaseModel
from fastapi import HTTPException
from .Database_class import DataBase
from src.preferences import Preferences
import logging
from fastapi import FastAPI

app = FastAPI()
logger = logging.getLogger("test_logger")
preferences = Preferences(api=app, logger=logger)


class Signup:
    def __init__(self, api, logger: logging.Logger):
        self.app = api
        self.logger = logger

        # register signup route
        self.handle_signup()

    def handle_signup(self):
        @self.app.post("/signup")
        async def signup_data(signup: SignupDetails):
            self.logger.info(
                f"Received signup attempt: {signup.username} {signup.password}"
            )

            try:
                if not self.signup_user(signup.username, signup.password):
                    return {"message": "Username already found"}

                return {
                    "message": f"Signup successful for user: {signup.username}"
                }

            except Exception as e:
                self.logger.error(f"Error processing login: {str(e)}")
                raise HTTPException(
                    status_code=500, detail="Internal server error"
                )

    def signup_user(self, username: str, password: str):
        db = DataBase()
        db.connect_db()
        table_name = "user_table"

        # If the user is not found, return False
        if db.search_user(table_name, username):
            self.logger.warning(f"User {username} already exists")
            db.close_con()
            return False

        self.logger.info(f"User {username} available")

        signup_data = {"username": username, "password": password}

        db.add_entry(table_name, signup_data)

        self.logger.info(f"User {username} signed up")
        db.close_con()
        
        preferences.db_initialise_preferences(username)
        return True


class SignupDetails(BaseModel):
    username: str
    password: str
