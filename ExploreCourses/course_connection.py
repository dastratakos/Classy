import os
from pprint import pprint
import requests
import time
import xml.etree.ElementTree as ET

from course import Course
import filters


class CourseConnection():

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

    def get_schools(self, academic_year: str = None):
        """
        Gets all schools within the university.

        Args:
            academic_year (Optional[str]): The academic year within which to 
                                           retrive schools from (e.g.
                                           "2021-2022"). Defaults to None.

        Returns:
            List[School]: The schools contained within the university.

        """

        payload = {
            "view": "xml",
            "year": academic_year.replace('-', '')
        }
        res = self.session.get(self.URL, params=payload)

        root = ET.fromstring(res.content)
        schools = root.findall(".//school")

        ret = []
        for school in schools:
            s = {"name": school.get("name")}
            depts = []
            for dept in school.findall("department"):
                depts.append({
                    "longname": dept.get("longname"),
                    "name": dept.get("name"),
                })
            s["departments"] = depts
            ret.append(s)

        return ret

    def download_all_courses_by_year(self, year, dir: str = "data"):
        """ Downloads all active courses from ExploreCourses for the given year
        and saves the data to the specified directory.

        Args:
            year (str):           The year of courses to download (e.g.
                                  "2021-2022")
            dir (str, optional):  The directory to save data to. Defaults to
                                  "data".
        """
        print(f"Downloading all {year} courses...")

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
        for school in self.get_schools(year):
            start = time.time()
            name = school["name"]
            departments = school["departments"]

            for dept in school["departments"]:
                courses = self.download_courses_from_connection(
                    name, dept["name"], *filters_list, year=year, dir=f"{dir}/{year}")
                all_courses.extend(courses)

            end = time.time()
            print(
                f"({end - start:.2f} s) {name}: {len(departments)}, {len(all_courses)}")

        total_end = time.time()
        print(f"Total time: {total_end - total_start:.2f} s")
        print(f"Total courses: {len(all_courses)}\n")

    def get_all_courses_from_downloads(self, dir: str = "data", only_2022: bool = False):
        print("Getting all courses from downloads...")

        total_start = time.time()

        all_courses = {}

        for year in sorted(os.listdir(dir)):

            if only_2022:
                year = "2021-2022"

            year_dir = os.path.join(dir, year)
            if os.path.isfile(year_dir):
                continue

            print(year)

            year_start = time.time()

            schools = sorted(os.listdir(year_dir))
            for school in schools:
                school_dir = os.path.join(year_dir, school)
                if os.path.isfile(school_dir):
                    continue

                school_start = time.time()

                departments = sorted(os.listdir(school_dir))
                for dept in departments:
                    with open(f"{school_dir}/{dept}") as f:
                        root = ET.fromstring(f.read())
                        courses = root.findall(".//course")

                        for course in courses:
                            c = Course(course)
                            if c.courseId in all_courses:
                                all_courses[c.courseId] = all_courses[c.courseId] + c
                            else:
                                all_courses[c.courseId] = c

                school_end = time.time()
                print(
                    f"({school_end - school_start:.2f} s) {school}: {len(departments)}")

            year_end = time.time()
            print(
                f"({year_end - year_start:.2f} s) {year}: {len(schools)} schools, {len(all_courses)} total courses\n")

            if only_2022:
                return all_courses

        total_end = time.time()
        print(f"Total time: {total_end - total_start:.2f} s")
        print(f"Total courses: {len(all_courses)}\n")

        return all_courses
