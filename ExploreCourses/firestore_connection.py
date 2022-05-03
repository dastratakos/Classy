from pprint import pprint

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


class FirestoreConnection:

    def __init__(self):
        # Use a service account
        cred = credentials.Certificate(
            './cs194w-team4-firebase-adminsdk-nlhhi-817038c561.json')
        firebase_admin.initialize_app(cred)

        self.db = firestore.client()

    def read_data(self):
        users_ref = self.db.collection(u'users')
        docs = users_ref.stream()

        for doc in docs:
            print(f'{doc.id} => {doc.to_dict()}')