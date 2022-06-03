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

export default function EnrollmentCard({
  enrollment,
  editable = true,
  emphasized = false,
}: {
  enrollment: Enrollment;
  editable?: boolean;
  emphasized?: boolean;
}) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteEnrollment = async () => {
    setModalVisible(false);
    await deleteEnrollment(enrollment);
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
    <View>
      <EnrollmentModal
        enrollment={enrollment}
        deleteFunc={deleteEnrollmentAlert}
        visible={modalVisible}
        setVisible={setModalVisible}
        editable={editable && enrollment.userId === context.user.id}
      />
      <View
        style={[
          styles.container,
          AppStyles.boxShadow,
          { backgroundColor: Colors[colorScheme].cardBackground },
        ]}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.innerContainer}
        >
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {emphasized ? "⭐️ " : null}
              {enrollment.code.join(", ")}
            </Text>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.medium,
    paddingVertical: Layout.spacing.small,
    borderRadius: Layout.radius.medium,
    marginVertical: Layout.spacing.small,
    width: "100%",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    backgroundColor: "transparent",
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
    borderRadius: Layout.radius.xsmall,
    marginLeft: Layout.spacing.small,
    backgroundColor: "transparent",
  },
  numberText: {
    fontSize: Layout.text.xlarge,
  },
  friendsText: {
    fontSize: Layout.text.medium,
  },
});
