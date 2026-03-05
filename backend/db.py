from pymongo import MongoClient

# --- DATABASE SETUP ---
client = MongoClient("mongodb//localhost:27017/")
db = client["HardwareDB"]
users_collection = db["users"]
projects_collection = db["projects"]
resources_collection = db["resources"]


