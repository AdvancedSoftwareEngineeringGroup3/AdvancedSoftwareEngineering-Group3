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
    def api_send_friend_request(self):
        @self.app.post("/send_request")
        async def request_data(request: RequestData):
            self.logger.info(f"Received friend request from {request.sender} to {request.receiver}")
            
            if request.sender == request.receiver:
                return{
                    "message": "Cannot send request to self"
                }
            else:
                response = self.db_handle_friend_request(self, request.sender, request.receiver)
                return{
                    "message": response
                }

    def db_handle_friend_request(self, sender, receiver):
        db = DataBase()
        db.connect_db()
        table_name = "user_table"

        if db.search_user(table_name, receiver):
            try:
                request_list = db.search_entry(table_name, receiver, "pending_friends")
                if sender not in request_list:
                    db.append_entry(table_name, sender, receiver, "pending_friends")
                    self.logger.info(f"Friend request sent successfully")
                    db.close_con()
                    return f"Friend request to {receiver} sent successfully"
                else:
                    self.logger.info(f"Friend request already sent")
                    db.close_con()
                    return "Friend request already sent"
            except Exception as e:
                self.logger(e)
                print(e)
                db.close_con()
                return "Error during friend request"
        else:
            self.logger.info(f"User {receiver} not found")
            db.close_con()
            return f"User \"{receiver}\" not found"

    # client requests pending friend requests
    def api_fetch_all_friends(self):
        @self.app.post("/check_requests")
        async def check_friends_list(user: str):
            self.logger.info(f"Received request for pending friends from {user}")
            friends, pending_friends = self.fetch_all_friends(user)
            self.logger.info("Friends & Pending friends retrieved")
            return {
                "friends": friends,
                "pending_friends": pending_friends
            }
            
    def db_fetch_all_friends(user):
        table_name = "user_table"
        db = DataBase()
        db.connect_db()
        friends_list = db.search_entry(table_name, user, "friends_list")
        pending_friends = db.search_entry(table_name, user, "pending_friends")
        db.close_con()
        return friends_list, pending_friends
    

    def api_friend_request_response(self):
        @self.app.post("/request_response")
        async def answer_friend_request(user: str, requester: str, answer: bool):
            self.logger.info(f"Processing friend request from {requester} to {user}")
            return_msg = self.db_friend_request_response(self, user, requester, answer)            

            return {
                "message": return_msg
            }
            
    def db_friend_request_response(self, user: str, requester: str, answer: bool):
        db = DataBase()
        db.connect_db()
        table_name = "user_table"
        friend_column = "friends_list"
        pending_friends_column = "pending_friends"

        # remove from pending friends
        db.remove_from_array(table_name, user, pending_friends_column, requester)

        if db.search_user("user_table", requester):
            # if answer is yes (true)
            if answer:
                # add to friends
                db.append_entry(table_name, requester, user, friend_column) 
                db.append_entry(table_name, user, requester, friend_column)
                db.close_con()
                self.logger.info(f"{user} and {requester} are now friends")
                return f"New friend {requester} added"
            else:
                db.close_con()
                self.logger.info(f"Friend request denied")
                return f"Friend request declined"
            
        else:
            db.close_con()
            self.logger.info(f"Requester '{requester}' not found in user_table")
            return "user not found"

class RequestData(BaseModel):
    sender: str
    receiver: str

class CurrentUser(BaseModel):
    user: str

if __name__ == "__main__":
    pass