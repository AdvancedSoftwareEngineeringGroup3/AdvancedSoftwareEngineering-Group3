from pydantic import BaseModel
import os
from dotenv import load_dotenv
import logging
from fastapi import HTTPException

from Database_class import DataBase

class Networking():
    def __init__(self, api, logger: logging.Logger):
        self.app = api
        self.logger = logger
        # self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        # Load environment vars
        load_dotenv()
        # self.supabase_url = os.getenv("SUPABASE_URL")
        # self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

        # register login route
        self.handle_login()

    # client sends request to server
    def handle_friend_request_sent(self):
        @self.app.post("/send_request")
        async def request_data(request: RequestData):
            self.logger.info(f"Received friend request from {request.sender} to {request.receiver}")
            
            if (self.update_pending_friends(request.sender, request.receiver)):
                self.logger.info(f"Friend request successfully sent to {request.receiver}")

                return {"message": f"Friend request successfully sent to {request.receiver}"}
            
            return {"message": f"Friend request to {request.receiver} unsuccessful"}

    def update_pending_friends(sender, receiver):
        table_name = "user_table"
        if search_user(table_name, receiver):
            try:
                request_list = search_entry(table_name, receiver, "pending_friends")
                if sender not in request_list:
                    append_entry(table_name, sender, receiver, "pending_friends")
                    self.logger.info(f"Friend request sent successfully")
                else:
                    self.logger.info(f"Friend request already sent")
            except Exception as e:
                self.logger(e)
                print(e)
        else:
            self.logger.info(f"User {receiver} not found")

    # client requests pending friend requests
    def handle_pending_friend_request(self):
        @self.app.post("/check_requests")
        async def check_friends_list(user: str):
            self.logger.info(f"Received request for pending friends from {user}")
            # TODO: switch out "update_pending_friends"
            if (self.update_pending_friends(request.sender, request.receiver)):
                self.logger.info(f"Friend request successfully sent to {request.receiver}")

                return {"message": f"Friend request successfully sent to {request.receiver}"}
            
            return {"message": f"Friend request to {request.receiver} unsuccessful"}

class RequestData(BaseModel):
    sender: str
    receiver: str

if __name__ == "__main__":
    pass