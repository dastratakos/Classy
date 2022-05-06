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


if __name__ == "__main__":
    """
    Step 1: Download all courses from 2021-2022 to 2016-2017.
    """
    # download_courses()

    """
    Step 2: Load all courses into dictionary of Course objects.
    """
    all_courses = load_courses(from_pkl=True)

    """
    Step 3: Create a FirestoreConnection object and upload each course.
    """
    firestore_connection = FirestoreConnection()
    
    # firestore_connection.read_course(next(iter(all_courses.items())))
    # firestore_connection.read_data(collection="users")
    # firestore_connection.add_courses(all_courses)
    # firestore_connection.add_terms(all_courses)
    
    # while True:
    #     search = input("Enter a search word: ")
    #     firestore_connection.search(search)
    #     print()
