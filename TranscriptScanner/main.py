import PyPDF2

FILENAME = "dean.pdf"

with open(FILENAME, "rb") as f:
    pdfReader = PyPDF2.PdfFileReader(f)

    text = ""
    for i in range(pdfReader.numPages):
        text += pdfReader.getPage(i).extractText()

name = None
id_number = None
academic_advisor = None
# programs = []

for line in text.split("\n"):
    if line.startswith("Name"):
        name = line.split(":")[-1].strip()
    elif line.startswith("Student ID"):
        id_number = line.split(":")[-1].strip()
    elif line.startswith("Academic Advisor"):
        academic_advisor = line.split(":")[-1].strip()

# print(f"name: {name}")
# print(f"id_number: {id_number}")
# print(f"academic_advisor: {academic_advisor}")

# print(text)

# ===========================================================================

output = "Term,Code,Component,Title,Attempted,Earned,Grade,Instructor(s)\n"

BEG = "--------- Beginning of Academic  Record ---------"
END = "--------- Non-Course Milestones ---------"
COURSE_BEG = "Course Cmpt Title Attempted Earned Grade"
QUARTERS = ["Autumn", "Winter", "Spring", "Summer"]
GARBAGE = f"""Leland Stanford Jr. University
Stanford, CA 94305 
USAUndergraduate Unofficial Transcript - Detailed
Name : {name}
Student ID : {id_number}
Information must be kept confidential and must not be disclosed to other parties without the written consent of the student."""

academic_record = text[text.find(BEG) + len(BEG):text.find(END)]

first_term = academic_record.split("\n")[0].strip()
first_year = int(first_term.split("-")[0])
# first_quarter = QUARTERS.index(first_
# term.split()[-1])

curr_year = first_year
done = False
while not done:

    for i in range(len(QUARTERS)):
        curr_term = f"{curr_year}-{curr_year + 1} {QUARTERS[i]}"
        if i == len(QUARTERS) - 1:
            next_term = f"{curr_year + 1}-{curr_year + 2} {QUARTERS[0]}"
            next_next_term = f"{curr_year + 1}-{curr_year + 2} {QUARTERS[1]}"
        elif i == len(QUARTERS) - 2:
            next_term = f"{curr_year}-{curr_year + 1} {QUARTERS[i + 1]}"
            next_next_term = f"{curr_year + 1}-{curr_year + 2} {QUARTERS[0]}"
        else:
            next_term = f"{curr_year}-{curr_year + 1} {QUARTERS[i + 1]}"
            next_next_term = f"{curr_year}-{curr_year + 1} {QUARTERS[i + 2]}"

        # print(curr_term)

        start_index = academic_record.find(curr_term)
        if start_index == -1:
            continue
        start_index += len(curr_term)

        end_index = academic_record.find(next_term)
        if end_index == -1:
            end_index = academic_record.find(next_next_term)
            if end_index == -1:
                done = True
                quarter_text = academic_record[start_index:]
            else:
                quarter_text = academic_record[start_index:end_index]
        else:
            quarter_text = academic_record[start_index:end_index]

        start_index = quarter_text.find(COURSE_BEG)
        end_index = quarter_text.find("UG Term GPA")

        assert start_index != -1 and end_index != -1

        courses_text = quarter_text[start_index + len(COURSE_BEG):end_index] \
            .strip().replace(GARBAGE, "")

        # print(courses_text)
        # print("-" * 100)

        curr_dept, curr_code, curr_cmpt = [""] * 3
        curr_title = []
        curr_attempted, curr_earned, curr_grade = [""] * 3
        curr_instructor = []
        for line in courses_text.split("\n"):
            tokens = line.split()

            if not len(tokens):
                continue

            if (curr_earned and len(tokens) >= 2 and
                tokens[0].replace("&", "").isalpha() and tokens[0].isupper() and
                    (tokens[1].isdecimal() or tokens[1][0].isdecimal())):
                
                title = ' '.join(curr_title).strip()
                if title.count(","):
                    title = f'"{title}"'
                
                output += f"{curr_term},{curr_dept} {curr_code},"
                output += f"{curr_cmpt},{title},"
                output += f"{curr_attempted},{curr_earned},{curr_grade},"
                output += f"{'; '.join(curr_instructor).strip()}\n"
                # print("---")

                curr_dept, curr_code, curr_cmpt = [""] * 3
                curr_title = []
                curr_attempted, curr_earned, curr_grade = [""] * 3
                curr_instructor = []

            elif curr_earned:
                curr_instructor.extend([x.strip() for x in line.split(";")])
                continue

            for token in tokens:
                if not curr_dept:
                    curr_dept = token
                elif not curr_code:
                    curr_code = token
                elif not curr_cmpt:
                    curr_cmpt = token
                elif curr_earned:
                    curr_grade = token
                else:
                    period_index = token.find(".")
                    if (period_index == -1 or period_index == 0 or
                            not token[period_index - 1].isdecimal()):
                        curr_title.append(token)
                        continue

                    if curr_attempted:
                        curr_earned = token
                        continue

                    curr_title.append(token[:period_index - 1])
                    curr_attempted = token[period_index - 1:]

        title = ' '.join(curr_title).strip()
        if title.count(","):
            title = f'"{title}"'
        
        output += f"{curr_term},{curr_dept} {curr_code},"
        output += f"{curr_cmpt},{title},"
        output += f"{curr_attempted},{curr_earned},{curr_grade},"
        output += f"{'; '.join(curr_instructor).strip()}\n"
        # print("---")

    curr_year += 1
    # print()

with open(FILENAME.replace(".pdf", ".csv"), "w") as f:
    f.write(output)