import { Course } from "../../types";
import CourseCard from "../Cards/CourseCard";
import { View } from "../Themed";

export default function CourseList({ courses }: { courses: Course[] }) {
  // TODO: use FlatList
  return (
    <>
      {courses.map((course) => (
        <View key={course.courseId.toString()}>
          <CourseCard course={course} numFriends={0} emphasize={false} />
        </View>
      ))}
    </>
  );
}
