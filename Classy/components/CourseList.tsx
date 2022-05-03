import { Course } from "../types";
import CourseCard from "./CourseCard";

export default function CourseList({ courses }: { courses: Course[] }) {
  return (
    <>
      {courses.map((course, i) => (
        <CourseCard
          course={course}
          numFriends={"0"}
          emphasize={false}
          key={i}
        />
      ))}
    </>
  );
}
