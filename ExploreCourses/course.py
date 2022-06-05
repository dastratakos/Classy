from calendar import c
import copy
from datetime import datetime, timedelta, timezone
import html
import os
from pprint import pprint
from typing import List
import xml.etree.ElementTree as ET


class Course():

    def __init__(self, elem: ET.Element):
        """
        Constructs a new Course from an XML element.

        Args:
            elem (Element): The course"s XML element.
        """

        self.courseId = int(elem.findtext(".//courseId"))

        self.latestYear = elem.findtext("year")
        self.code = [elem.findtext("subject") + " " + elem.findtext("code")]
        self.title = self.clean_title(elem.findtext("title"))
        self.description = html.unescape(elem.findtext("description"))
        self.gers = elem.findtext("gers").split(", ")
        self.repeatable = elem.findtext("repeatable")
        self.unitsMin = int(elem.findtext("unitsMin"))
        self.unitsMax = int(elem.findtext("unitsMax"))
        self.remote = elem.findtext("remote")

        """ administrativeInformation sub-tag """
        self.effectiveStatus = elem.findtext(".//effectiveStatus")
        self.academicGroup = [elem.findtext(".//academicGroup")]
        self.academicOrganization = [elem.findtext(".//academicOrganization")]
        self.academicCareer = [elem.findtext(".//academicCareer")]
        self.finalExamFlag = elem.findtext(".//finalExamFlag")
        self.maxUnitsRepeat = int(elem.findtext(".//maxUnitsRepeat"))
        self.maxTimesRepeat = int(elem.findtext(".//maxTimesRepeat"))

        """ keywords for search """
        self.keywords = self.generate_keywords(
            self.courseId, self.code, self.title)

        """ term sub-collection """
        grading = self.construct_grading(elem.findtext("grading"))
        self.terms = self.construct_terms(elem.find("sections"), grading)

    def is_code(self, string):
        """ Checks if a string is a course code (e.g. "CS 194W").

        Args:
            string (string): The string to check.

        Returns:
            boolean: True if string is a code, false otherwise.
        """

        pieces = string.split()

        return (len(pieces) == 2 and
                pieces[0].isupper() and
                pieces[1][0].isnumeric())

    def clean_title(self, t):
        """ Removes cross-listed course codes from the title.

        Args:
            title (string): The original title

        Returns:
            string: The cleaned title
        """
        title = t.strip()
        if title[-1] == ")":
            index = title.rfind("(")
            text = title[index + 1: -1]
            codes = text.split(", ")
            if codes and self.is_code(codes[0]):
                title = title[:index]

        if t == title:
            return title
        else:
            return self.clean_title(title)

    def construct_grading(self, grading):
        simple_grading = {
            "Credit/No Credit",
            "GSB Letter Graded",
            "GSB Pass/Fail",
            "GSB Student Option LTR/PF",
            "Letter (ABCD/NP)"
            "Medical Option (Med-Ltr-CR/NC)",
            "Medical Satisfactory/No Credit",
            "Satisfactory/No Credit",
            "TGR",
        }

        if grading in simple_grading:
            return [grading]
        elif grading == "Letter or Credit/No Credit":
            return ["Letter (ABCD/NP)", "Credit/No Credit"]
        elif grading == "Law Mixed H/P/R/F or MP/R/F":
            return ["Law Honors/Pass/Restricted Credit/Fail",
                    "Law Mandatory Pass/Restricted credit/Fail"]
        elif grading == "Law Honors/Pass/Restrd Cr/Fail":
            return ["Law Honors/Pass/Restricted Credit/Fail"]
        elif grading == "Law Mandatory P/R/F":
            return ["Law Mandatory Pass/Restricted credit/Fail"]
        elif grading == "Medical School MD Grades":
            return ["Medical School +/- Option"]
        elif grading == "RO Satisfactory/Unsatisfactory":
            return ["Satisfactory/No Credit"]

        # unknown grading basis
        return [grading]

    def construct_terms(self, sections: ET.Element, grading: List[str]):
        """ Constructs the terms from the sections element by combining sections
        within the same quarter.

        The grading parameter is necessary since the grading basis for a course
        may change year to year.

        Args:
            sections (ET.Element):  The sections to parse
            grading (List[str]):    The grading basis for this year

        Returns:
            dictionary:  Dictionary mapping terms to Lists of sections.
        """
        def utc_to_local(utc_dt):
            return utc_dt.replace(tzinfo=timezone.utc).astimezone(tz=None) + \
                timedelta(hours=7)

        terms = {}

        for section in sections:
            schedule = section.find("schedules")[0]

            startDate = schedule.findtext("startDate")
            endDate = schedule.findtext("endDate")

            startTime = schedule.findtext("startTime")
            endTime = schedule.findtext("endTime")

            if startDate == "":
                startInfo = None
            elif startTime == "":
                startInfo = utc_to_local(
                    datetime.strptime(startDate, "%b %d, %Y"))
            else:
                startInfo = utc_to_local(datetime.strptime(
                    f"{startDate} {startTime}", "%b %d, %Y %I:%M:%S %p"))

            if endDate == "":
                endInfo = None
            elif endTime == "":
                endInfo = utc_to_local(datetime.strptime(endDate, "%b %d, %Y"))
            else:
                endInfo = utc_to_local(datetime.strptime(
                    f"{endDate} {endTime}", "%b %d, %Y %I:%M:%S %p"))

            sec = {
                "termId": int(section.findtext("termId")),
                "sectionNumber": section.findtext("sectionNumber"),
                "component": section.findtext("component"),
                "grading": grading,

                "startInfo": startInfo,
                "endInfo": endInfo,
                "location": schedule.findtext("location"),
                "days": schedule.findtext("days").split(),
                "instructors": [self.construct_instructor(instr)
                                for instr in schedule.find("instructors")]
            }

            if sec["termId"] in terms:
                terms[sec["termId"]].append(sec)
            else:
                terms[sec["termId"]] = [sec]

        return terms

        # After parsing all the sections
        # for each term:
        #     determine which section is primary
        #     set self.terms[termId][primarySchedule] = the one we found
        #     set self.terms[termId][sections] = a list of rest of sections

    def construct_instructor(self, elem: ET.Element):
        instructor = {}

        instructor["name"] = elem.findtext("name")
        instructor["firstName"] = elem.findtext("firstName")
        instructor["middleName"] = elem.findtext("middleName")
        instructor["lastName"] = elem.findtext("lastName")
        instructor["sunet"] = elem.findtext("sunet")
        instructor["role"] = elem.findtext("role")

        return instructor

    def generate_keywords(self, courseId, c, t):
        def generate_substrings(string):
            substrings = []
            pieces = string.split(" ")
            for i in range(len(pieces)):
                substr = ""
                for ch in " ".join(pieces[i:]):
                    substr += ch
                    substrings.append(substr)
            return substrings

        keywords = [str(courseId)]

        codes = [x.lower() for x in c] + \
                [x.lower().replace(" ", "") for x in c]
        for code in codes:
            keywords.extend(generate_substrings(code))

        title = t.lower()
        keywords.extend(generate_substrings(title))

        return sorted(list(set(keywords)))

    def __add__(self, course):
        if self.courseId != course.courseId:
            return None

        if course.latestYear >= self.latestYear:
            new_course = copy.deepcopy(course)
            old_course = self
        else:
            new_course = copy.deepcopy(self)
            old_course = course

        for i, code in enumerate(old_course.code):
            if code not in new_course.code:
                new_course.code.append(code)
                new_course.academicGroup.append(old_course.academicGroup[i])
                new_course.academicOrganization.append(
                    old_course.academicOrganization[i])
                new_course.academicCareer.append(old_course.academicCareer[i])

        new_course.academicGroup = [x for _, x in sorted(
            zip(new_course.code, new_course.academicGroup))]
        new_course.academicOrganization = [x for _, x in sorted(
            zip(new_course.code, new_course.academicOrganization))]
        new_course.academicCareer = [x for _, x in sorted(
            zip(new_course.code, new_course.academicCareer))]
        new_course.code = sorted(new_course.code)

        new_course.keywords = sorted(list(
            set(old_course.keywords + new_course.keywords)))

        for term, sections in old_course.terms.items():
            if term not in new_course.terms:
                new_course.terms[term] = sections

        return new_course

    def __str__(self):
        """
        Returns a string representation of the Course that includes the 
        course"s subject, code, and full title.

        """

        ret = f"{self.code}: {self.title}\n"

        ret += f"courseId: {self.courseId}\n"
        ret += f"latestYear: {self.latestYear}\n"
        ret += f"description: {self.description}\n"
        ret += f"gers: {self.gers}\n"
        ret += f"repeatable: {self.repeatable}\n"
        ret += f"unitsMin: {self.unitsMin}\n"
        ret += f"unitsMax: {self.unitsMax}\n"
        ret += f"remote: {self.remote}\n"
        ret += f"effectiveStatus: {self.effectiveStatus}\n"
        ret += f"academicGroup: {self.academicGroup}\n"
        ret += f"academicOrganization: {self.academicOrganization}\n"
        ret += f"academicCareer: {self.academicCareer}\n"
        ret += f"finalExamFlag: {self.finalExamFlag}\n"
        ret += f"maxUnitsRepeat: {self.maxUnitsRepeat}\n"
        ret += f"maxTimesRepeat: {self.maxTimesRepeat}\n"
        ret += f"keywords: {self.keywords}\n"

        pprint(self.terms)

        return ret


if __name__ == "__main__":
    # dups = []
    # for course in sorted(os.listdir("duplicates"), reverse=True):
    #     tree = ET.parse(f"duplicates/{course}")
    #     course = tree.getroot()
    #     dups.append(Course(course))

    # combo = dups[0] + dups[1] + dups[2]

    # print(combo)
    # pprint(sorted(combo.keywords))

    tree = ET.parse("test/ME-104B.xml")
    course = tree.getroot()
    c = Course(course)
    print(c)
    pprint(sorted(c.keywords))

    print("generate_keywords:")
    pprint(c.generate_keywords(210741, ["ME 104B"], "Designing Your Life"))
