import { Enrollment } from "../../types";
import EnrollmentCard from "../Cards/EnrollmentCard";
import { View, Text } from "../../components/Themed";

export default function EnrollmentList({
  enrollments,
}: {
  enrollments: Enrollment[];
}) {
  // TODO: use FlatList
  return (
    <>
      {enrollments.length > 0 ? enrollments.map((enrollment, i) => (
        <EnrollmentCard
          enrollment={enrollment}
          key={`${enrollment.courseId}`}
        />
      )) : 
        <View>
          <Text>no courses</Text>
        </View>
      }
    </>
  );
}
