import { Enrollment } from "../../types";
import EnrollmentCard from "../Cards/EnrollmentCard";

export default function EnrollmentList({
  enrollments,
}: {
  enrollments: Enrollment[];
}) {
  // TODO: use FlatList
  return (
    <>
      {enrollments.map((enrollment, i) => (
        <EnrollmentCard
          enrollment={enrollment}
          key={`${enrollment.courseId}`}
        />
      ))}
    </>
  );
}
