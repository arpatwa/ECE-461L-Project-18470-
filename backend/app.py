from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# -----------------------------
# DATABASE SETUP
# -----------------------------
LOCAL_URI = "mongodb://localhost:27017/"

try:
    client = MongoClient(LOCAL_URI)
    db = client["HardwareDB"]
    users_collection = db["users"]
    projects_collection = db["projects"]
    resources_collection = db["resources"]

    client.admin.command('ping')
    print("Connected to MongoDB!")

except Exception as e:
    print(f"MongoDB Connection Error: {e}")

# -----------------------------
# PASSWORD FUNCTIONS
# -----------------------------

def hash_password(password):
    return generate_password_hash(password)


def check_password(password, hashed):
    return check_password_hash(hashed, password)

# -----------------------------
# USER AUTH
# -----------------------------

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password required"}), 400

    if users_collection.find_one({"username": data["username"]}):
        return jsonify({"error": "Username already exists"}), 400

    hashed_pw = hash_password(data["password"])

    result = users_collection.insert_one({
        "username": data["username"],
        "password": hashed_pw
    })

    return jsonify({
        "message": "User created",
        "id": str(result.inserted_id)
    }), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    if not data:
        return jsonify({"error": "Missing request body"}), 400

    user = users_collection.find_one({"username": data.get("username")})

    if user and check_password(data.get("password"), user["password"]):
        return jsonify({
            "message": "Login successful",
            "username": user["username"]
        })

    return jsonify({"error": "Invalid username or password"}), 401


# -----------------------------
# PROJECT ROUTES
# -----------------------------

@app.route("/projects", methods=["POST"])
def create_project():
    data = request.json

    project = {
        "name": data["name"],
        "owner": data["owner"],
        "members": [data["owner"]]
    }

    projects_collection.insert_one(project)

    return jsonify({"message": "Project created"})


@app.route("/projects", methods=["GET"])
def get_projects():
    projects = list(projects_collection.find({}, {"_id": 0}))
    return jsonify(projects)


@app.route("/projects/<name>", methods=["DELETE"])
def delete_project(name):
    projects_collection.delete_one({"name": name})
    return jsonify({"message": "Project deleted"})


# -----------------------------
# RESOURCE ROUTES
# -----------------------------

@app.route("/resources", methods=["POST"])
def add_resource():
    data = request.json

    resource = {
        "name": data["name"],
        "capacity": data["capacity"],
        "available": data["capacity"]
    }

    resources_collection.insert_one(resource)

    return jsonify({"message": "Resource added"})


@app.route("/resources", methods=["GET"])
def get_resources():
    resources = list(resources_collection.find({}, {"_id": 0}))
    return jsonify(resources)


# -----------------------------
# CHECKOUT
# -----------------------------

@app.route("/checkout", methods=["POST"])
def checkout():
    data = request.json

    resource = resources_collection.find_one({"name": data["name"]})

    if not resource:
        return jsonify({"error": "Resource not found"}), 404

    if resource["available"] <= 0:
        return jsonify({"error": "Resource unavailable"}), 400

    resources_collection.update_one(
        {"name": data["name"]},
        {"$inc": {"available": -1}}
    )

    return jsonify({"message": "Hardware checked out"})


# -----------------------------
# CHECKIN
# -----------------------------

@app.route("/checkin", methods=["POST"])
def checkin():
    data = request.json

    resources_collection.update_one(
        {"name": data["name"]},
        {"$inc": {"available": 1}}
    )

    return jsonify({"message": "Hardware returned"})


# -----------------------------
# TEST ROUTE
# -----------------------------

@app.route("/")
def home():
    return jsonify({"message": "Hardware Resource System API running"})


# -----------------------------

if __name__ == "__main__":
    app.run(port=5000, debug=True)