import EmptyList from "../EmptyList";
import { Enrollment } from "../../types";
import EnrollmentCard from "../Cards/EnrollmentCard";
import { View } from "../Themed";

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
        <View key={enrollment.courseId.toString() + i.toString()}>
          <EnrollmentCard enrollment={enrollment} />
        </View>
      ))}
    </>
  );
}
