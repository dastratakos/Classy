import copy
from datetime import datetime
import os
from pprint import pprint
import xml.etree.ElementTree as ET


class Course():

    def __init__(self, elem: ET.Element):
        """
        Constructs a new Course from an XML element.

        Args:
            elem (Element): The course's XML element.
        """

        self.courseId = int(elem.findtext(".//courseId"))

        self.latestYear = elem.findtext("year")
        self.code = [elem.findtext("subject") + " " + elem.findtext("code")]
        self.title = elem.findtext("title")
        self.description = elem.findtext("description")
        self.gers = elem.findtext("gers").split(", ")
        self.repeatable = (True if elem.findtext("repeatable") == "true"
                           else False if elem.findtext("repeatable") == "true"
                           else None)
        self.grading = elem.findtext("grading")
        self.unitsMin = int(elem.findtext("unitsMin"))
        self.unitsMax = int(elem.findtext("unitsMax"))
        self.remote = (True if elem.findtext("remote") == "true"
                       else False if elem.findtext("remote") == "false"
                       else None)

        """ administrativeInformation sub-tag """
        self.effectiveStatus = elem.findtext(".//effectiveStatus")
        # self.active = (True if elem.findtext(".//effectiveStatus") == "A"
        #                else False if elem.findtext(".//effectiveStatus") == "I"
        #                else None)
        self.academicGroup = [elem.findtext(".//academicGroup")]
        self.academicOrganization = [elem.findtext(".//academicOrganization")]
        self.academicCareer = elem.findtext(".//academicCareer")
        self.finalExamFlag = (True if elem.findtext(".//finalExamFlag") == "Y"
                              else False if elem.findtext(".//finalExamFlag") == "N"
                              else None)
        self.maxUnitsRepeat = int(elem.findtext(".//maxUnitsRepeat"))
        self.maxTimesRepeat = int(elem.findtext(".//maxTimesRepeat"))

        """ term sub-collection """
        self.terms = self.construct_terms(elem.find("sections"))

    def construct_terms(self, sections: ET.Element):
        # TODO: construct self.terms dictionary mapping termIds to Terms

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
                startInfo = datetime.strptime(startDate, "%b %d, %Y")
            else:
                startInfo = datetime.strptime(
                    f"{startDate} {startTime}", "%b %d, %Y %I:%M:%S %p")

            if endDate == "":
                endInfo = None
            elif endTime == "":
                endInfo = datetime.strptime(endDate, "%b %d, %Y")
            else:
                endInfo = datetime.strptime(
                    f"{endDate} {endTime}", "%b %d, %Y %I:%M:%S %p")

            sec = {
                "termId": section.findtext("termId"),
                "sectionNumber": section.findtext("sectionNumber"),
                "component": section.findtext("component"),

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
        for term, sections in old_course.terms.items():
            if term not in new_course.terms:
                new_course.terms[term] = sections

        return new_course

    def __str__(self):
        """
        Returns a string representation of the Course that includes the 
        course's subject, code, and full title.

        """

        ret = f"({self.courseId}) {self.code}: {self.title}\n"

        ret += f"latestYear: {self.latestYear}\n"
        ret += f"description: {self.description}\n"
        ret += f"gers: {self.gers}\n"
        ret += f"repeatable: {self.repeatable}\n"
        ret += f"grading: {self.grading}\n"
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
        ret += f"terms: {pprint(self.terms)}\n"

        return ret


if __name__ == "__main__":
    dups = []
    for course in sorted(os.listdir("duplicates")):
        tree = ET.parse(f"duplicates/{course}")
        course = tree.getroot()
        dups.append(Course(course))
        
    print(dups[0] + dups[1])
    print(dups[0])
    print(dups[1])

    # Create two courses with same courseId, then add them together
