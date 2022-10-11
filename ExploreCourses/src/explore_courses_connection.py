"""
explore_courses_connection.py
-----------------------------
Author: Dean Stratakos
Date: October 5, 2022
"""

import os
from pprint import pprint
import requests
import time
import xml.etree.ElementTree as ET

from src.explore_courses_course import Course
import src.filters as filters


class ExploreCoursesConnection():
    """ This class represents a connection to ExploreCourses, the course
    catalog for Stanford University. It exposes a few simple get methods.

    TODO: This class should be made generic for different universities.

    CMU API: https://github.com/ScottyLabs/course-api **might work**
    Harvard University API:
        https://portal.apis.huit.harvard.edu/docs/ats-course-v2/1/overview
    UC Berkeley API: https://api-central.berkeley.edu/api/72
    USC API: https://web-app.usc.edu/web/soc/help
    """

    __URL = "https://explorecourses.stanford.edu/"

    def __init__(self):
        """ Constructs a new ExploreCoursesConnection object by beginning a
        requests session.
        """
        self.__session = requests.Session()

    def get_schools(self, academic_year: str = None):
        """ Gets all schools from the catalog.

        Args:
            academic_year (Optional[str]): The academic year within which to 
                                          retrive schools from (e.g.
                                          "2021-2022"). Defaults to None.

        Returns:
            List[School]: The schools contained within the university.

            List[{
                "name": str,
                "departments": List[{
                    "longname": str,
                    "name": str
                }]
            }]
        """

        params = {
            "view": "xml",
            "academicYear": academic_year.replace("-", "")
        }

        res = self.__session.get(self.__URL, params=params)

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

    def __get_courses_by_query(self,
                               query: str,
                               *filters: str,
                               academic_year: str = None):
        """ Makes a get request to ExploreCourses with the given query. Returns
        the courses from the response.

        Args:
            query (str):                    The query of the call. TODO: put example
            academic_year (str, optional):  The year to query (e.g.
                                            "2022-2023"). Defaults to None.

        Returns:
            bytes:                          An XML object containing the
                                            courses.
        """

        url = self.__URL + "search"

        params = {
            "view": "xml-20200810",
            "filter-coursestatus-Active": "on",
            "q": query,
        }
        params.update({f: "on" for f in filters})
        if academic_year:
            params.update({"academicYear": academic_year.replace("-", "")})

        res = self.__session.get(url, params=params)
        return res.content

    def get_courses(self,
                    department_code: str,
                    academic_year: str,
                    filters: str = filters.ACTIVE):
        """ Downloads the courses for a specific department and year. The data
        is then returned as bytes.

        Args:
            department_code (str):          The department to query.
            academic_year (str, optional):  The year to query (e.g.
                                            "2022-2023").

        Returns:
            bytes:                          An XML object containing all the
                                            courses.
        """
        filters.append(f"filter-departmentcode-{department_code}")
        courses = self.__get_courses_by_query(department_code,
                                              *filters,
                                              academic_year=academic_year)
        return courses
