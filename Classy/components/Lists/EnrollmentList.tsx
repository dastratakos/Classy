import { Enrollment } from "../../types";
import EnrollmentCard from "../Cards/EnrollmentCard";
import EmptyList from "../EmptyList";

export default function EnrollmentList({
  enrollments,
  emptyElement,
}: {
  enrollments: Enrollment[];
  emptyElement?: JSX.Element;
}) {
  if (enrollments.length === 0) return <>{emptyElement || <EmptyList />}</>;

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
