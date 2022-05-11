import { Course } from "../../types";
import CourseCard from "../Cards/CourseCard";

export default function CourseList({ courses }: { courses: Course[] }) {
  // TODO: use FlatList
  return (
    <>
      {courses.map((course, i) => (
        <CourseCard
          course={course}
          key={`${course.courseId}`}
          numFriends={0}
          emphasize={false}
        />
      ))}
    </>
  );
}
