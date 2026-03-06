from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import hashlib

app = Flask(__name__)
CORS(app)

# -----------------------------
# 1. LOCAL DATABASE SETUP
# -----------------------------
# No password or SSL needed for default local installation
LOCAL_URI = "mongodb://localhost:27017/"
#hello gurl
try:
    client = MongoClient(LOCAL_URI)
    db = client["HardwareDB"]
    
    users_collection = db["users"]
    projects_collection = db["projects"]
    resources_collection = db["resources"]
    
    # Test connection
    client.admin.command('ping')
    print("Successfully connected to LOCAL MongoDB!")
except Exception as e:
    print(f"Local MongoDB Connection Error: {e}")
    print("Make sure MongoDB Community Server is running!")

# -----------------------------
# 2. UTILS & ROUTES (Same as before)
# -----------------------------
def secure_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if users_collection.find_one({"username": data.get('username')}):
        return jsonify({"error": "Username already exists"}), 400

    hashed_pw = secure_password(data.get('password'))
    result = users_collection.insert_one({
        "username": data['username'],
        "password": hashed_pw
    })
    return jsonify({"message": "User created", "id": str(result.inserted_id)}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({"username": data.get('username')})
    if user and user['password'] == secure_password(data.get('password')):
        return jsonify({"message": "Login successful", "username": user['username']}), 200
    return jsonify({"error": "Invalid username or password"}), 401

if __name__ == "__main__":
    app.run(port=5000, debug=True)