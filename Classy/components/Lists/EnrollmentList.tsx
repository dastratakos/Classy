import EmptyList from "../EmptyList";
import { Enrollment } from "../../types";
import EnrollmentCard from "../Cards/EnrollmentCard";
import { View } from "../Themed";
import { useContext } from "react";
import AppContext from "../../context/Context";

export default function EnrollmentList({
  enrollments,
  editable = true,
  checkMutual = false,
  emptyElement,
}: {
  enrollments: Enrollment[];
  editable?: boolean;
  checkMutual?: boolean;
  emptyElement?: JSX.Element;
}) {
  if (enrollments.length === 0) return <>{emptyElement || <EmptyList />}</>;

  const context = useContext(AppContext);

  return (
    <>
      {enrollments.map((enrollment, i) => (
        <View key={enrollment.courseId.toString() + i.toString()}>
          <EnrollmentCard
            enrollment={enrollment}
            editable={editable}
            mutual={
              checkMutual &&
              context.enrollments
                .map((e: Enrollment) => e.courseId)
                .includes(enrollment.courseId)
            }
          />
        </View>
      ))}
    </>
  );
}
