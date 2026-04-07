from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import urllib.parse

def seed_resources():
    default_resources = [
        {"name": "HWSet1", "capacity": 100, "available": 100},
        {"name": "HWSet2", "capacity": 100, "available": 100},
    ]

    for resource in default_resources:
        existing = resources_collection.find_one({"name": resource["name"]})
        if not existing:
            resources_collection.insert_one(resource)

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

# -----------------------------
# DATABASE SETUP
# -----------------------------
# LOCAL_URI = "mongodb://localhost:27017/"
load_dotenv()
# Get credentials from environment
username = urllib.parse.quote_plus(os.getenv("MONGO_USER"))
password = urllib.parse.quote_plus(os.getenv("MONGO_PASS"))
cluster = os.getenv("MONGO_CLUSTER")
db_name = os.getenv("MONGO_DB")

# atlast 
ATLAS_URI = f"mongodb+srv://{username}:{password}@{cluster}/{db_name}?retryWrites=true&w=majority"


try:
    # client = MongoClient(LOCAL_URI)
    client = MongoClient(ATLAS_URI)
    db = client["HardwareDB"]
    users_collection = db["users"]
    projects_collection = db["projects"]
    resources_collection = db["resources"]

    client.admin.command('ping')
    print("Connected to MongoDB Atlas!")
    seed_resources()

except Exception as e:
    print(f"MongoDB Atlas Connection Error: {e}")

# -----------------------------
# RSA SETUP (MANUAL)
# -----------------------------
n = 3233
e = 17
d = 2753


def rsa_decrypt(ciphertext):
    try:
        numbers = list(map(int, ciphertext.split(",")))
        decrypted = [chr(pow(num, d, n)) for num in numbers]
        return ''.join(decrypted)
    except:
        return None


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

    # RSA DECRYPT
    decrypted_pw = rsa_decrypt(data["password"])
    if decrypted_pw is None:
        return jsonify({"error": "Invalid encrypted password"}), 400


    # HASH AFTER DECRYPTION
    hashed_pw = hash_password(decrypted_pw)


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



    # RSA DECRYPT
    decrypted_pw = rsa_decrypt(data.get("password"))
    if decrypted_pw is None:
        return jsonify({"error": "Invalid encrypted password"}), 400


    if check_password(decrypted_pw, user["password"]):
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

    # Prevent duplicate project IDs (test case)
    if projects_collection.find_one({"projectID": data["projectID"]}):
        return jsonify({"error": "Project ID already exists"}), 400

    project = {
        # Frontend sends all data to backend
        "projectID": data["projectID"],
        "name": data["name"],
        "description": data.get("description", ""),
        "owner": data["owner"],
        "members": [data["owner"]],
        # For check in/out updates
        "checkedOutResources": {
            "HWSet1": 0, # New projects have 0 HW sets
            "HWSet2": 0
        }
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

# Joining Projects that exist using ID
@app.route("/projects/join", methods=["POST"])
def join_project():
    data = request.json
    if not data or not data.get("projectID") or not data.get("username"):
        return jsonify({"error": "Project ID and username required"}), 400

    project = projects_collection.find_one({"projectID": data["projectID"]})
    if not project:
        return jsonify({"error": "Project has not been found"}), 404

    # Check if the user is already a member of the given projectID
    if data["username"] in project.get("members", []):
        return jsonify({"message": "Already joined"}), 200
    # update member list if they were not part of the project before
    projects_collection.update_one(
        {"projectID": data["projectID"]},
        {"$push": {"members": data["username"]}}
    )

    return jsonify({
        "message": f"Project joined successfully: {project['projectID']} ({project['name']})",
        "projectID": project["projectID"],
        "name": project["name"]
    }), 200


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

# Get resources per each project
@app.route("/resources/<projectID>", methods=["GET"])
def get_resources_for_project(projectID):
    username = request.args.get("username")

    # Make sure the project selected actually exists (it should if it can be accessed from Resources tab)
    project = projects_collection.find_one({"projectID": projectID})
    if not project:
        return jsonify({"error": "Project not found"}),404
    # Make sure the user that is trying to check out is a member of the project (again, should be bc has access in resources tab)
    if username not in project.get("members", []):
        return jsonify({"error": "Authorized access denied"}), 403 # Auth code error for https
    # Access global resources
    resources = list(resources_collection.find({}, {"_id": 0}))

    # Get resources specific to the project we are working with
    checked_out = project.get("checkedOutResources", {})

    combine =[]
    for resource in resources:
        project_count= checked_out.get(resource["name"], 0) # Default 0 if no entry for that HW set

        # Return what frontend needs to read for UI
        combine.append({
            "name": resource["name"],
            "capacity": resource["capacity"],
            "available": resource["available"],
            "inUse": resource["capacity"] - resource["available"],
            "yourProject": project_count,

        })

    return jsonify(combine) # Give info to front end

# -----------------------------
# CHECKOUT
# -----------------------------

@app.route("/checkout", methods=["POST"])
def checkout():
    data = request.json

    projectID = data.get("projectID")
    username = data.get("username")
    resource_name = data.get("name")
    qty = int(data.get("qty", 0))

    if not projectID or not username or not resource_name or qty <= 0:
        return jsonify({"error": "Missing or invalid checkout data"}), 400
    # Check if project exists
    project = projects_collection.find_one({"projectID": projectID})
    if not project:
        return jsonify({"error": "Project not found"}), 404
    # Check if who wants to check out is a member
    if username not in project.get("members", []):
        return jsonify({"error": "Unauthorized"}), 403

    resource = resources_collection.find_one({"name":resource_name})
    if not resource:
        return jsonify({"error": "Resource not found"}), 404

    if resource["available"] < qty:
        return jsonify({"error": "Resource unavailable"}), 400

    # Update global HW sets
    resources_collection.update_one(
        {"name": data["name"]},
        {"$inc": {"available": -qty}} # Remove how many was entered
    )
    # Update project HW set values
    projects_collection.update_one(
        {"projectID": projectID},
        {"$inc": {f"checkedOutResources.{resource_name}": qty}}
    )

    return jsonify({"message": f"Checked out {qty} units of {resource_name}"}), 200


# -----------------------------
# CHECKIN
# -----------------------------

@app.route("/checkin", methods=["POST"])
def checkin():
    data = request.json

    projectID = data.get("projectID")
    username = data.get("username")
    resource_name = data.get("name")
    qty = int(data.get("qty", 0))

    if not projectID or not username or not resource_name or qty <= 0:
        return jsonify({"error": "Missing or invalid checkout data"}), 400
    # Check if project exists
    project = projects_collection.find_one({"projectID": projectID})
    if not project:
        return jsonify({"error": "Project not found"}), 404
    # Check if who wants to check out is a member
    if username not in project.get("members", []):
        return jsonify({"error": "Unauthorized"}), 403

    current_qty = project.get("checkedOutResources", {}).get(resource_name, 0) # Default 0 if HW set not valid

    # Check if we have x number of checked out to check in
    if current_qty < qty:
        return jsonify({"error": "Project does not have this many units checked out"}), 400

    resources_collection.update_one(
        {"name": data["name"]},
        {"$inc": {"available": qty}} # Adding qty to global resources
    )

    projects_collection.update_one(
        {"projectID": projectID},
        {"$inc": {f"checkedOutResources.{resource_name}": -qty}}
    )

    return jsonify({"message": f"Checked in {qty} units of {resource_name}"}), 200 # Success with check in


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return app.send_static_file(path)
    else:
        return app.send_static_file('index.html')

# -----------------------------
# TEST ROUTE
# -----------------------------

# @app.route("/")
# def home():
#     return jsonify({"message": "Hardware Resource System API running"})


# -----------------------------

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use Heroku port if available, else 5000
    app.run(host="0.0.0.0", port=port, debug=True)