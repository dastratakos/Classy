# ExploreCourses design doc

## `main.py`
Interacts with the command prompt via ArgParse.
Interacts with explorecourses.stanford.edu via CourseConnection.
    The user can also download a local copy of this data.
Interacts with Firestore via FirestoreConnection.

User can:
- ExploreCourses
  - read
    - raw query
    - 
  - download local copy
  - read from local copy
- Firestore
  - read data
    - asdf
  - write data
    - asdf



main
    download_all_courses_by_year(academicYear)

## `explore_courses_connection.py`

ExploreCoursesConnection
    public
        __init__()
        query(): returns courses
        get_schools(academic_year)
        get_courses(year, code): returns courses. limit by year/code because data structure would get too large?

    private
        __session
        <!-- __get_courses_by_query_raw(query, *filters, year=None) -->

## `explore_courses_course.py`

Course
    Creates a Course object out of an XML element.

    public
        __init__(XML)

    private
        everything else

## `firestore_connection.py`

FirestoreConnection
    public
        get_all_users()
        search_users(search)
        update_users_with_keywords()

        get_course(courseId)
        search_courses(search)

        set_course(course): single course at a time
        set_courses(courses): allows for batch writing
        update_courses_with_terms(courses): batch writing (does not modify course doc)

        adjust_enrollment_times()
        update_enrollments_with_colors()

    private

## `persistent_storage.py`

NestedPersistentStorage
    stores data in a nested structure. Each file has the same depth and the files are XML formatted lists of items. (TODO remove XML dependency).

    public
        __init__(dir, depth)
        read()
        read_from_pkl()
        write(file, filename, *path): len(path) should be equal to depth

    private

data/year/school/dept.xml
data/all_data.pkl
depth = 2 (number of directories after dir ("data/"))

## Brainstorming
- maybe separate interfaces between ExploreCourses and Firestore
- PersistentStorage class?
  - write
  - read