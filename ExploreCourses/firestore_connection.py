from pprint import pprint

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from tqdm import tqdm


class FirestoreConnection:

    def __init__(self):
        # Use a service account
        cred = credentials.Certificate(
            "./cs194w-team4-firebase-adminsdk-nlhhi-817038c561.json")
        firebase_admin.initialize_app(cred)

        self.db = firestore.client()

    def read_data(self, collection="users"):
        users_ref = self.db.collection(f"{collection}").limit(3)
        docs = users_ref.stream()

        for doc in docs:
            print(f"{doc.id} => {doc.to_dict()}")

    def read_course(self, item):
        courseId, course = item

        print(f"Original course: {course}")
        print(f"Original courseId: {courseId}")

        course_ref = self.db.collection(u"courses").document(f"{courseId}")

        doc = course_ref.get()
        if doc.exists:
            print(f"Document data: {doc.to_dict()}")
        else:
            print(u"No such document!")
            return

        terms_ref = course_ref.collection(u"terms")
        docs = terms_ref.stream()

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
            u"keywords": course.keywords,
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

    def add_courses(self, all_courses):
        i = 0
        for course in tqdm(all_courses.values()):
            if i % 250 == 0:
                batch = self.db.batch()

            data = {
                u"courseId": course.courseId,
                u"code": course.code,
                u"title": course.title,
                u"latestYear": course.latestYear,
                u"description": course.description,
                u"gers": course.gers,
                u"repeatable": course.repeatable,
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
                u"keywords": course.keywords,
            }

            course_ref = self.db.collection(u"courses").document(
                f"{course.courseId}")
            batch.set(course_ref, data, merge=True)

            if i % 250 == 249 or i == len(all_courses) - 1:
                batch.commit()

            i += 1

    def add_terms(self, all_courses):
        i = 0
        for course in tqdm(reversed(all_courses.values())):
            course_ref = self.db.collection(u"courses").document(
                f"{course.courseId}")

            for termId, terms in course.terms.items():
                if i % 250 == 0:
                    batch = self.db.batch()

                # if i % 100 == 0 or i % 100 == 99:
                #     print(f"i = {i}")

                term_data = {
                    "schedules": terms
                }

                term_ref = course_ref.collection(
                    u"terms").document(f"{termId}")
                batch.set(term_ref, term_data)

                if i % 250 == 249:
                    batch.commit()

                i += 1

        print(f"processed {i} terms")
        batch.commit()

    def search(self, search, collection="courses"):
        coll_ref = self.db.collection(f"{collection}")

        docs = coll_ref.where(u"keywords", u"array_contains",
                              f"{search.lower().strip()}").order_by(u"code").limit(5).stream()

        for doc in docs:
            print(
                f"({doc.id}) {doc.to_dict()['code']}: {doc.to_dict()['title']}")
