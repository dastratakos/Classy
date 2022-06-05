import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import { Enrollment } from "../../types";
import AppStyles from "../../styles/AppStyles";
import { useContext, useState } from "react";
import EnrollmentModal from "../EnrollmentModal";
import { deleteEnrollment } from "../../services/enrollments";
import AppContext from "../../context/Context";
import { getUser } from "../../services/users";

export default function EnrollmentCard({
  enrollment,
  editable = true,
  mutual = false,
}: {
  enrollment: Enrollment;
  editable?: boolean;
  mutual?: boolean;
}) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteEnrollment = async () => {
    setModalVisible(false);
    await deleteEnrollment(enrollment);

    let newEnrollments = context.enrollments.filter(
      (e: Enrollment) =>
        e.courseId !== enrollment.courseId || e.termId !== enrollment.termId
    );
    context.setEnrollments([...newEnrollments]);

    context.setUser(await getUser(context.user.id));
  };

  const deleteEnrollmentAlert = () => {
    Alert.alert("Delete course", `Are you sure?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: handleDeleteEnrollment,
      },
    ]);
  };

  return (
    <>
      <EnrollmentModal
        enrollment={enrollment}
        deleteFunc={deleteEnrollmentAlert}
        visible={modalVisible}
        setVisible={setModalVisible}
        editable={editable && enrollment.userId === context.user.id}
      />
      <TouchableOpacity
        style={[
          styles.container,
          AppStyles.boxShadow,
          { backgroundColor: Colors[colorScheme].cardBackground },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.textContainer}>
          <View style={styles.codeContainer}>
            {mutual && (
              <View style={styles.mutualContainer}>
                <Text style={styles.mutualText}>Mutual</Text>
              </View>
            )}
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {enrollment.code.join(", ")}
              </Text>
            </View>
          </View>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {enrollment.title}
          </Text>
        </View>
        {enrollment.numFriends !== -1 && (
          <View style={styles.numFriendsContainer}>
            <Text style={styles.numberText}>{enrollment.numFriends}</Text>
            <Text style={styles.friendsText}>
              {"friend" + (enrollment.numFriends !== 1 ? "s" : "")}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.medium,
    paddingVertical: Layout.spacing.small,
    borderRadius: Layout.radius.medium,
    marginVertical: Layout.spacing.small,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  textContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  mutualContainer: {
    backgroundColor: Colors.pink,
    padding: Layout.spacing.xxsmall,
    marginRight: Layout.spacing.xsmall,
    borderRadius: Layout.radius.medium,
  },
  mutualText: {
    fontSize: Layout.text.small,
    color: Colors.white,
  },
  cardTitleContainer: {
    backgroundColor: "transparent",
    flex: 1,
  },
  cardTitle: {
    fontSize: Layout.text.xlarge,
    // fontWeight: "500",
  },
  cardSubtitle: {
    fontSize: Layout.text.medium,
  },
  numFriendsContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 55,
    marginLeft: Layout.spacing.xxsmall,
    backgroundColor: "transparent",
  },
  numberText: {
    fontSize: Layout.text.xlarge,
  },
  friendsText: {
    fontSize: Layout.text.medium,
  },
});
