import { Enrollment } from "../../types";
import EnrollmentCard from "../Cards/EnrollmentCard";
import EmptyList from "../EmptyList";

export default function EnrollmentList({
  enrollments,
  emptyPrimary,
  emptySecondary,
}: {
  enrollments: Enrollment[];
  emptyPrimary?: string;
  emptySecondary?: string;
}) {
  // TODO: use FlatList
  return (
    <>
      {enrollments.length > 0 ? (
        enrollments.map((enrollment, i) => (
          <EnrollmentCard
            enrollment={enrollment}
            key={`${enrollment.courseId}`}
          />
        ))
      ) : (
        <EmptyList
          primaryText={emptyPrimary ? emptyPrimary : ""}
          secondaryText={emptySecondary ? emptySecondary : ""}
        />
      )}
    </>
  );
}
