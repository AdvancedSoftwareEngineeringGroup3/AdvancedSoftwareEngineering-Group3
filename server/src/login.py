from pydantic import BaseModel
import logging
from fastapi import HTTPException
from .Database_class import DataBase


class Login:

    def __init__(self, api, logger: logging.Logger):
        self.app = api
        self.logger = logger

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


class LoginDetails(BaseModel):
    username: str
    password: str
