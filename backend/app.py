from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import hashlib

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://bno356_db_user:cookiebosa67@cluster0.t2wl4de.mongodb.net/HardwareDB?retryWrites=true&w=majority"
mongo = PyMongo(app)

# --- MODULAR SECURITY HELPERS ---

def secure_password(password, encrypt=True):
    """Returns a SHA-256 hash if encrypt is True, otherwise plain text."""
    if encrypt:
        # SHA-256 is a standard alternative to bcrypt
        return hashlib.sha256(password.encode()).hexdigest()
    return password

def verify_password(stored_password, provided_password, was_encrypted):
    """Compares passwords based on whether the original was encrypted."""
    if was_encrypted:
        return stored_password == hashlib.sha256(provided_password.encode()).hexdigest()
    return stored_password == provided_password

# --- ROUTES ---

@app.route('/signup', methods=['POST'])
def signup():
    users = mongo.db.users
    data = request.json
    
    # Check if user exists
    if users.find_one({"username": data['username']}):
        return jsonify({"error": "Username already exists"}), 400

    # Decide if you want to encrypt this specific user (True/False)
    # You could even pass this from React if you wanted!
    should_encrypt = True 

    processed_password = secure_password(data['password'], encrypt=should_encrypt)

    user_id = users.insert_one({
        "username": data['username'],
        "password": processed_password,
        "is_encrypted": should_encrypt  # Store metadata so we know how to check it later
    }).inserted_id

    return jsonify({"message": "User created", "id": str(user_id)}), 201

@app.route('/login', methods=['POST'])
def login():
    users = mongo.db.users
    data = request.json
    
    user = users.find_one({"username": data['username']})

    if user:
        # Use our modular verifier
        is_valid = verify_password(
            user['password'], 
            data['password'], 
            user.get('is_encrypted', False) # Default to False if field is missing
        )
        
        if is_valid:
            return jsonify({"message": "Login successful", "username": user['username']}), 200
    
    return jsonify({"error": "Invalid username or password"}), 401

if __name__ == "__main__":
    app.run(port=5000, debug=True)