import xml.etree.ElementTree as ET


class Class:

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
        self.gers = tuple(elem.findtext("gers").split(", "))
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
        self.construct_terms(elem.find("section"))

    def construct_terms(self, sections: ET.Element):
        # TODO: construct self.terms dictionary mapping termIds to Terms

        for section in sections:
            termId = section.findtext("termId")
            sectionNumber = section.findtext("sectionNumber")
            component = section.findtext("component")

            schedule = section.find("schedules")[0]
            startDate = schedule.findtext("startDate")
            endDate = schedule.findtext("endDate")
            startTime = schedule.findtext("startTime")
            endTime = schedule.findtext("endTime")
            location = schedule.findtext("location")
            days = [schedule.findtext("days").split()]
            instructors = [self.construct_instructor(instr)
                           for instr in schedule.find("instructors")]
            
            # TODO: may want to create a section object
            
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

    def update_with_xml(self, new_elem: ET.Element):
        # if new year >= curr year, then overwrite and append to term schedule
        # if new year < curr year, then just append term schedule
        pass
