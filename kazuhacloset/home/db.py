from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

_client = None

def get_client():
    global _client
    if _client is None:
        _client = MongoClient(
            os.getenv('MONGO_URI'),
            maxPoolSize=10,
            minPoolSize=2,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            socketTimeoutMS=10000,
            retryWrites=True,
        )
    return _client

# All collections in one place
client         = get_client()
users_collection         = client["LoginData"]["Users"]
orders_collection        = client["Orders"]["order_collections"]
order_history_collection = client["History"]["order_history"]