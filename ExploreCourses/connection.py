import os
import requests
import time
import xml.etree.ElementTree as ET

from classes import Course


class Connection():

    URL = "https://explorecourses.stanford.edu/"

    def __init__(self):
        """
        Constructs a new CourseConnection by beginning a requests session.

        """

        self.session = requests.Session()

    def get_courses_by_query_raw(self, query: str, *filters: str, year=None):
        """ Downloads the courses matching the query using the API from the
        explorecourses module.

        Args:
            query (str):           The query of the call.
            year (int, optional):  The year to query. Defaults to None.

        Returns:
            bytes:                 An XML object containing all the courses.
        """

        url = self.URL + "search"

        payload = {
            "view": "xml-20200810",
            "filter-coursestatus-Active": "on",
            "q": query,
        }
        payload.update({f: "on" for f in filters})
        if year:
            payload.update({"academicYear": year.replace('-', '')})

        res = self.session.get(url, params=payload)

        return res.content

    def download_courses_from_connection(self, school: str, code: str,
                                         *filters: str, year: int = None,
                                         dir: str = "data"):
        """ Downloads the courses from a specific school and department for a given
        year using get_courses_by_query_raw(). The data is then saved as .xml files
        to the specified dir.

        Args:
            school (str):          The school to query.
            code (str):            The department to query.
            year (int, optional):  The year to query. Defaults to None.
            dir (str, optional):   The directory to write files to after they are
                                downloaded. Defaults to "data".

        Returns:
            bytes:                 An XML object containing all the courses.
        """
        filters = list(filters)
        filters.append(f"filter-departmentcode-{code}")

        courses = self.get_courses_by_query_raw(code, *filters, year=year)

        if not os.path.exists(f"{dir}"):
            os.mkdir(f"{dir}")

        if not os.path.exists(f"{dir}/{school}"):
            os.mkdir(f"{dir}/{school}")

        if not os.path.exists(f"{dir}/{school}/{code}.xml"):
            with open(f"{dir}/{school}/{code}.xml", "xb") as f:
                f.write(courses)

        return courses
    
    def download_all_courses(self, dir: str = "data"):
        """ Downloads all active courses from ExploreCourses and saves the data to
        the specified directory.

        Args:
            dir (str, optional):  The directory to save data to. Defaults to "data".
        """
        print("Downloading all courses...")

        total_start = time.time()

        # filter for actively offered courses
        filters_list = {
            filters.AUTUMN,
            filters.WINTER,
            filters.SPRING,
            filters.SUMMER
        }

        # Get all courses for 2021-2022
        all_courses = []
        year = "2021-2022"
        for school in self.get_schools(year):
            start = time.time()

            for dept in school.departments:
                courses = self.download_courses_from_connection(
                    school, dept.code, *filters_list, year=year, dir=dir)
                all_courses.extend(courses)

            end = time.time()
            print(f"({end - start:.2f} s) {school}: {len(school.departments)}")

        total_end = time.time()
        print(f"Total time: {total_end - total_start:.2f} s")
        print(f"Total courses: {len(all_courses)}\n")
        
    def get_all_courses_from_downloads(dir: str = "data"):
        print("Getting all courses from downloads...")

        total_start = time.time()

        all_courses = []

        for school in sorted(os.listdir(dir)):
            if os.path.isfile(os.path.join(dir, school)):
                continue

            start = time.time()

            departments = sorted(os.listdir(os.path.join(dir, school)))

            for dept in departments:
                with open(f"{dir}/{school}/{dept}") as f:
                    root = ET.fromstring(f.read())
                    courses = root.findall(".//course")
                    all_courses.extend([Course(course) for course in courses])

            end = time.time()
            print(f"({end - start:.2f} s) {school}: {len(departments)}")

        total_end = time.time()
        print(f"Total time: {total_end - total_start:.2f} s")
        print(f"Total courses: {len(all_courses)}\n")

        return all_courses
