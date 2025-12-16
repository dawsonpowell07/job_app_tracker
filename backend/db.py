import firebase_admin
from firebase_admin import credentials, firestore
from settings import settings
import os

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK if not already initialized."""
    if not firebase_admin._apps:
        cred_path = settings.firebase_credentials_path
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # Use default credentials for development or Cloud Run
            firebase_admin.initialize_app()


def get_firestore_client():
    """Get Firestore client instance."""
    initialize_firebase()
    return firestore.client()


# Application collection helpers
def get_applications_collection():
    """Get reference to applications collection."""
    db = get_firestore_client()
    return db.collection(settings.firestore_collection_applications)


def get_user_applications_collection(user_id: str):
    """Get reference to a user's applications subcollection."""
    db = get_firestore_client()
    return db.collection(settings.firestore_collection_users).document(user_id).collection("applications")
