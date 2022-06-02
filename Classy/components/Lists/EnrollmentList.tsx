import EmptyList from "../EmptyList";
import { Enrollment } from "../../types";
import EnrollmentCard from "../Cards/EnrollmentCard";
import { View } from "../Themed";

export default function EnrollmentList({
  enrollments,
  editable = true,
  emptyElement,
}: {
  enrollments: Enrollment[];
  editable?: boolean;
  emptyElement?: JSX.Element;
}) {
  if (enrollments.length === 0) return <>{emptyElement || <EmptyList />}</>;

  // TODO: use FlatList
  return (
    <>
      {enrollments.map((enrollment, i) => (
        <View key={enrollment.courseId.toString() + i.toString()}>
          <EnrollmentCard enrollment={enrollment} editable={editable} />
        </View>
      ))}
    </>
  );
}
