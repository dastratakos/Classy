from firestore_connection import FirestoreConnection
from connection import Connection

if __name__ == "__main__":
    # all_courses = get_all_courses_from_downloads()
    
    firestore_connection = FirestoreConnection()
    firestore_connection.read_data()
