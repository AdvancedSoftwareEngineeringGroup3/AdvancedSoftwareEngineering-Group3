import asyncio
import websockets
import json

SERVER_URL = "ws://127.0.0.1:8000/ws/"  # WebSocket server URL

async def send_message(username):
    async with websockets.connect(SERVER_URL + username) as websocket:
        print(f"Connected as {username}!")

        async def receive_messages():
            """Handles incoming messages."""
            while True:
                try:
                    response = await websocket.recv()
                    message = json.loads(response)
                    print(f"\n📩 New message from {message['sender']}: {message['content']}")
                except websockets.exceptions.ConnectionClosed:
                    print("Disconnected from server.")
                    break

        asyncio.create_task(receive_messages())  # Start listening for messages

        while True:
            receiver = input("Enter recipient's name: ")
            content = input("Enter message: ")
            message = json.dumps({"sender": username, "receiver": receiver, "content": content})
            await websocket.send(message)

if __name__ == "__main__":
    user = input("Enter your username: ")
    asyncio.run(send_message(user))
