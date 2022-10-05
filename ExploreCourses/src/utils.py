from datetime import timedelta, timezone

def analyze_start_and_end_times(all_courses):
    earliest_start_hour = 8
    earliest_start_minute = 0
    earliest_start_code = []

    latest_end_hour = 6
    latest_end_minute = 0
    latest_end_code = []

    for course in all_courses.values():
        if 1226 not in course.terms:
            continue
        # print(course.terms[1226])
        for sched in course.terms[1226]:
            if (sched["startInfo"] and sched["startInfo"].hour != 0):
                start_hour = sched["startInfo"].hour
                start_minute = sched["startInfo"].minute

                if (start_hour < earliest_start_hour or
                    (start_hour == earliest_start_hour and
                     start_minute < earliest_start_minute)):
                    earliest_start_hour = start_hour
                    earliest_start_minute = start_minute
                    earliest_start_code = course.code

            if (sched["endInfo"] and sched["endInfo"].hour != 0):
                end_hour = sched["endInfo"].hour
                end_minute = sched["endInfo"].minute

                if (end_hour > latest_end_hour or
                    (end_hour == latest_end_hour and
                     end_minute > latest_end_minute)):
                    latest_end_hour = end_hour
                    latest_end_minute = end_minute
                    latest_end_code = course.code

    print(
        f"Earliest start time: {earliest_start_hour}:{earliest_start_minute} ({earliest_start_code})")
    print(
        f"Latest end time: {latest_end_hour}:{latest_end_minute} ({latest_end_code})")


def analyze_time_adjustment(all_courses):
    def utc_to_local(utc_dt):
        return utc_dt.replace(tzinfo=timezone.utc).astimezone(tz=None) + timedelta(hours=7)

    for course in all_courses.values():

        for term in course.terms.values():

            for sched in term:
                print("old:", sched["startInfo"], sched["startInfo"].tzname())
                print("new:", utc_to_local(sched["startInfo"]), utc_to_local(
                    sched["startInfo"]).tzname())
