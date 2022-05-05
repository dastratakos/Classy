from tqdm import tqdm

from firestore_connection import FirestoreConnection
from course_connection import CourseConnection

if __name__ == "__main__":
    """
    Step 1: Download all courses from 2021-2022 to 2016-2017.
    """
    cc = CourseConnection()
    # years = [f"{i}-{i+1}" for i in range(2016, 2022)]
    # years = [f"{i}-{i+1}" for i in range(2011, 2015)]
    # for year in years:
    #     cc.download_all_courses_by_year(year)

    """
    Step 2: Load all courses into dictionary of Course objects.
    """
    all_courses = cc.get_all_courses_from_downloads()
    
    print(f"Found {len(all_courses)} courses")
    
    num_docs = 0
    for course in all_courses.values():
        num_docs += 1
        num_docs += len(course.terms)
        
    print(f"{num_docs} number of docs")
    print(f"{(num_docs - len(all_courses)) / len(all_courses)} avg number of terms per doc")

    """
    Step 3: Create a FirestoreConnection object and upload each course.
    """
    firestore_connection = FirestoreConnection()
    # firestore_connection.read_data()
    firestore_connection.add_courses(all_courses)
    # for course in tqdm(all_courses.values()):
    #     firestore_connection.add_course(course)