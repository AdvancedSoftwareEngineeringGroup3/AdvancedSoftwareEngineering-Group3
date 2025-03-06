from pydantic import BaseModel

# May need to be changed in future with restructure of DB connection
from supabase import create_client, Client
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
import logging
from fastapi import HTTPException

class Login:
    def __init__(self, api, logger: logging.Logger):
        self.app = api
        self.logger = logger

        self.handle_signup()

    def handle_signup(self):
        @self.app.post("/signup")
        async def signup_data(signup: SignupDetails):
            self.logger.info(
                f"Received signup attempt: {signup.username} {signup.password}"
            )
            #try:
                # Check if username is already in database
                # If 



class SignupDetails(BaseModel):
    username: str
    password: str
