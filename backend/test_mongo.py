import certifi
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

uri = "mongodb+srv://bno356_db_user:cookiebosa67@cluster0.t2wl4de.mongodb.net/HardwareDB"

def try_connect(**kwargs):
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000, **kwargs)
        # force server discovery
        print("Ping:", client.admin.command("ping"))
    except ServerSelectionTimeoutError as e:
        print("failed:", e)

print(">>> default connection")
try_connect()

print("\n>>> explicit CA (certifi)")
try_connect(tls=True, tlsCAFile=certifi.where())

print("\n>>> disable cert checks (for diagnostics only)")
try_connect(tls=True, tlsAllowInvalidCertificates=True)
