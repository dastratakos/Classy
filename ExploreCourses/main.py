"""
main.py
----------------------
Author: Dean Stratakos
Date: October 5, 2022
"""

import time

from src.firestore_connection import FirestoreConnection
from src.explore_courses_connection import ExploreCoursesConnection
from src.nested_persistent_storage import NestedPersistentStorage

# CONFIG
DIR = "./data"
DEPTH = 2
ENTITY_NAME = "course"
PKL_FILENAME = "./all_courses_2011-2022.pkl"


def download_courses(start_year=2011, end_year=2022):
    ecc = ExploreCoursesConnection()
    nps = NestedPersistentStorage(dir=DIR,
                                  depth=DEPTH,
                                  entity_name=ENTITY_NAME)

    academic_years = [f"{i}-{i+1}" for i in range(start_year, end_year + 1)]

    for academic_year in academic_years:
        total_start = time.time()

        for school in ecc.get_schools(academic_year=academic_year):
            start = time.time()
            school_name = school["name"]
            departments = school["departments"]

            for dept in school["departments"]:
                department_code = dept["name"]

                courses = ecc.get_courses(department_code=department_code,
                                          academic_year=academic_year)

                nps.write(courses,
                          f"{department_code}.xml",
                          academic_year, school_name)

            end = time.time()
            print(f"  ({end - start:.2f} s) {school_name}: {len(departments)}")

        total_end = time.time()
        print(f"({total_end - total_start:.2f} s) {academic_year}")

    nps.generate_pkl(pkl_filename=PKL_FILENAME)


def load_courses():
    nps = NestedPersistentStorage(dir=DIR,
                                  depth=DEPTH,
                                  entity_name=ENTITY_NAME)

    all_courses = nps.load(pkl_filename=PKL_FILENAME)

    print(f"Found {len(all_courses)} courses")

    num_docs = 0
    for course in all_courses.values():
        num_docs += 1
        num_docs += len(course.terms)

    print(f"{num_docs} number of docs")
    avg = (num_docs - len(all_courses)) / len(all_courses)
    print(f"{avg} avg number of terms per doc")

    return all_courses


if __name__ == "__main__":
    # TODO: argparse

    """
    python3 main.py
    -r --read (print out or download?)
    -w --write (from loading or from downloading/uploading)
    -u --update (from loading or from downloading/uploading)
    -i --interactive (can perform reads and writes?)
    """

    """
    Step 1: Download all courses from 2021-2022 to 2016-2017.
    """
    # download_courses(start_year=2022, end_year=2022)
    download_courses(start_year=2012)

    """
    Step 2: Load all courses into dictionary of Course objects.
    """
    all_courses = load_courses()
    # all_courses = load_courses(from_pkl=True)
    # analyze_time_adjustment(all_courses)
    # analyze_start_and_end_times(all_courses)

    """
    Step 3: Create a FirestoreConnection object and upload each course.
    """
    # firestore_connection = FirestoreConnection()

    # firestore_connection.read_course(next(iter(all_courses.items())))
    # firestore_connection.read_data(collection="courses")
    # firestore_connection.add_courses(all_courses)
    # firestore_connection.add_terms(all_courses)
    # firestore_connection.adjust_enrollment_times(all_courses)
    # firestore_connection.add_keywords_to_users()
    # firestore_connection.adjust_course_times()
    # firestore_connection.add_enrollment_colors()

    # while True:
    #     search = input("Enter a search word: ")
    #     firestore_connection.search(search)
    #     print()
