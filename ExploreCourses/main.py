from datetime import timedelta, timezone
import pickle

from firestore_connection import FirestoreConnection
from course_connection import CourseConnection


def download_courses(start_year=2011, end_year=2021):
    cc = CourseConnection()
    years = [f"{i}-{i+1}" for i in range(start_year, end_year + 1)]
    for year in years:
        cc.download_all_courses_by_year(year)


def load_courses(from_pkl=True):
    if from_pkl:
        with open("all_courses.pkl", "rb") as f:
            print("Loading all courses from all_courses.pkl...")
            all_courses = pickle.load(f)

    else:
        cc = CourseConnection()
        all_courses = cc.get_all_courses_from_downloads()

        with open("all_courses.pkl", "wb") as f:
            pickle.dump(all_courses, f)

    print(f"Found {len(all_courses)} courses")

    num_docs = 0
    for course in all_courses.values():
        num_docs += 1
        num_docs += len(course.terms)

    print(f"{num_docs} number of docs")
    avg = (num_docs - len(all_courses)) / len(all_courses)
    print(f"{avg} avg number of terms per doc")

    return all_courses


def analyze_start_and_end_times(all_courses):
    earliest_start_hour = 8
    earliest_start_minute = 0
    earliest_start_code = []

    latest_end_hour = 6
    latest_end_minute = 0
    latest_end_code = []

    for course in all_courses.values():
        if 1226 not in course.terms:
            continue
        # print(course.terms[1226])
        for sched in course.terms[1226]:
            if (sched["startInfo"] and sched["startInfo"].hour != 0):
                start_hour = sched["startInfo"].hour
                start_minute = sched["startInfo"].minute

                if (start_hour < earliest_start_hour or
                    (start_hour == earliest_start_hour and
                     start_minute < earliest_start_minute)):
                    earliest_start_hour = start_hour
                    earliest_start_minute = start_minute
                    earliest_start_code = course.code

            if (sched["endInfo"] and sched["endInfo"].hour != 0):
                end_hour = sched["endInfo"].hour
                end_minute = sched["endInfo"].minute

                if (end_hour > latest_end_hour or
                    (end_hour == latest_end_hour and
                     end_minute > latest_end_minute)):
                    latest_end_hour = end_hour
                    latest_end_minute = end_minute
                    latest_end_code = course.code

    print(
        f"Earliest start time: {earliest_start_hour}:{earliest_start_minute} ({earliest_start_code})")
    print(
        f"Latest end time: {latest_end_hour}:{latest_end_minute} ({latest_end_code})")


def analyze_time_adjustment(all_courses):
    def utc_to_local(utc_dt):
        return utc_dt.replace(tzinfo=timezone.utc).astimezone(tz=None) + timedelta(hours=7)

    for course in all_courses.values():

        for term in course.terms.values():

            for sched in term:
                print("old:", sched["startInfo"], sched["startInfo"].tzname())
                print("new:", utc_to_local(sched["startInfo"]), utc_to_local(
                    sched["startInfo"]).tzname())


if __name__ == "__main__":
    """
    Step 1: Download all courses from 2021-2022 to 2016-2017.
    """
    # download_courses()

    """
    Step 2: Load all courses into dictionary of Course objects.
    """
    all_courses = load_courses(from_pkl=True)
    # analyze_time_adjustment(all_courses)
    # analyze_start_and_end_times(all_courses)

    """
    Step 3: Create a FirestoreConnection object and upload each course.
    """
    firestore_connection = FirestoreConnection()

    # firestore_connection.read_course(next(iter(all_courses.items())))
    # firestore_connection.read_data(collection="courses")
    # firestore_connection.add_courses(all_courses)
    # firestore_connection.add_terms(all_courses)
    # firestore_connection.adjust_enrollment_times(all_courses)
    # firestore_connection.add_keywords_to_users()
    # firestore_connection.adjust_course_times()

    # while True:
    #     search = input("Enter a search word: ")
    #     firestore_connection.search(search)
    #     print()
