from pprint import pprint

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


class FirestoreConnection:

    def __init__(self):
        # Use a service account
        cred = credentials.Certificate(
            "./cs194w-team4-firebase-adminsdk-nlhhi-817038c561.json")
        firebase_admin.initialize_app(cred)

        self.db = firestore.client()

    def read_data(self):
        users_ref = self.db.collection(u"users")
        docs = users_ref.stream()

        for doc in docs:
            print(f"{doc.id} => {doc.to_dict()}")

    def add_course(self, course):
        data = {
            u"courseId": course.courseId,
            u"code": course.code,
            u"title": course.title,
            u"latestYear": course.latestYear,
            u"description": course.description,
            u"gers": course.gers,
            u"repeatable": course.repeatable,
            u"grading": course.grading,
            u"unitsMin": course.unitsMin,
            u"unitsMax": course.unitsMax,
            u"remote": course.remote,
            u"effectiveStatus": course.effectiveStatus,
            u"academicGroup": course.academicGroup,
            u"academicOrganization": course.academicOrganization,
            u"academicCareer": course.academicCareer,
            u"finalExamFlag": course.finalExamFlag,
            u"maxUnitsRepeat": course.maxUnitsRepeat,
            u"maxTimesRepeat": course.maxTimesRepeat,
        }

        course_ref = self.db.collection(u"courses").document(
            f"{course.courseId}")
        course_ref.set(data)

        for termId, terms in course.terms.items():
            term_data = {
                "schedules": terms
            }

            term_ref = course_ref.collection(
                u"terms").document(f"{termId}")
            term_ref.set(term_data)
