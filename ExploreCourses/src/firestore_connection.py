"""
firestore_connection.py
-----------------------
Author: Dean Stratakos
Date: October 5, 2022
"""

from pprint import pprint
import random
from unicodedata import name

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from tqdm import tqdm


class FirestoreConnection:

    def __init__(self):
        # Use a service account
        cred = credentials.Certificate(
            "./cs194w-team4-843758eb5ad5.json")
        firebase_admin.initialize_app(cred)

        self.db = firestore.client()

    def read_data(self, collection="users"):
        collection_ref = self.db.collection(f"{collection}").limit(3)
        docs = collection_ref.stream()

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

    def __termId_in_year(self, termId: int, academic_year: str):
        return termId // 10 == (int(academic_year[:4]) - 1900 + 1)

    def add_terms(self, all_courses, academic_year=None):
        i = 0
        for course in tqdm(all_courses.values()):
            course_ref = self.db.collection(u"courses").document(
                f"{course.courseId}")

            for termId, terms in course.terms.items():
                if academic_year and not self.__termId_in_year(termId, academic_year):
                    continue

                if i % 250 == 0:
                    batch = self.db.batch()

                term_data = {"schedules": terms}

                term_ref = course_ref.collection(
                    u"terms").document(f"{termId}")
                # batch.update(term_ref, term_data)
                batch.set(term_ref, term_data)

                if i % 250 == 249:
                    batch.commit()

                i += 1

        print(f"processed {i} terms")
        batch.commit()

    def adjust_enrollment_times(self, all_courses):
        collection_ref = self.db.collection(u"enrollments")
        docs = collection_ref.stream()

        for doc in docs:
            print(f"doc.id: {doc.id}")

            enrollment = doc.to_dict()
            courseId = int(enrollment["courseId"])

            new_schedules = []

            for schedule in enrollment["schedules"]:
                termId = int(schedule["termId"])
                sectionNumber = schedule["sectionNumber"]

                # print(f"termId: {termId}")
                # print(f"sectionNumber: {sectionNumber}")

                if courseId not in all_courses:
                    print(f"ERROR: could not find courseId {courseId}")
                gold_course = all_courses[courseId]

                if termId not in gold_course.terms:
                    print(
                        f"ERROR: could not find termId {termId} for courseId {courseId}")

                found_schedule = False
                for gold_schedule in gold_course.terms[termId]:
                    if sectionNumber == gold_schedule["sectionNumber"]:
                        # print(f"gold_schedule: {gold_schedule}")
                        found_schedule = True
                        new_schedules.append(gold_schedule)
                        break

                if not found_schedule:
                    print(
                        f"ERROR: could not find sectionNumber {sectionNumber} for termId {termId} for courseId {courseId}")

            # print(f"new_schedules = {new_schedules}")

            enrollment_ref = self.db.collection(
                u"enrollments").document(f"{doc.id}")
            enrollment_ref.update({"schedules": new_schedules})

    def search(self, search, collection="courses"):
        coll_ref = self.db.collection(f"{collection}")

        docs = coll_ref.where(u"keywords", u"array_contains",
                              f"{search.lower().strip()}").order_by(u"code").limit(5).stream()

        for doc in docs:
            print(
                f"({doc.id}) {doc.to_dict()['code']}: {doc.to_dict()['title']}")

    def add_keywords_to_users(self):
        def generate_substrings(string):
            substrings = []
            pieces = string.split(" ")
            for i in range(len(pieces)):
                substr = ""
                for ch in " ".join(pieces[i:]):
                    substr += ch
                    substrings.append(substr)
            return substrings

        users_ref = self.db.collection(u"users")
        docs = users_ref.stream()

        for doc in docs:
            id = doc.id
            name = doc.to_dict()['name']

            keywords = generate_substrings(name.lower())

            data = {
                u"keywords": keywords,
            }

            user_ref = self.db.collection(u"users").document(f"{id}")
            user_ref.update(data)

    def add_enrollment_colors(self):
        colors = [
            "#C3291C" + "AA",
            "#E25D33" + "AA",
            "#FF7F0A" + "AA",
            "#EDC14B" + "AA",
            "#FFA098" + "AA",
            "#D88177" + "AA",
            "#397E49" + "AA",
            "#5DB37E" + "AA",
            "#4599DF" + "AA",
            "#4350AF" + "AA",
            "#832DA4" + "AA",
            "#616161" + "AA",
        ]

        enrollments_ref = self.db.collection(u"enrollments")
        docs = enrollments_ref.stream()

        for doc in docs:
            id = doc.id

            data = {
                u"color": random.choice(colors),
            }

            enrollment_ref = self.db.collection(
                u"enrollments").document(f"{id}")
            enrollment_ref.update(data)
