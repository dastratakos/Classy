import { Pressable, StyleSheet, Alert } from "react-native";
import { ActivityIndicator, Text, View } from "../Themed";
import { componentToName, getCurrentTermId, getTimeString } from "../../utils";

import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import CourseOverviewModal from "../CourseOverviewModal";
import {
  CourseOverview as CourseOverviewType,
  Enrollment,
  User,
} from "../../types";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { useContext, useEffect, useState } from "react";
import EmptyList from "../EmptyList";
import EnrollmentModal from "../EnrollmentModal";
import { deleteEnrollment } from "../../services/enrollments";
import AppContext from "../../context/Context";
import { getFriendsInCourse } from "../../services/friends";
import { getUser } from "../../services/users";

export default function CourseOverview({
  data,
  refreshParent = () => {},
}: {
  data: CourseOverviewType;
  refreshParent?: () => void;
}) {
  const navigation = useNavigation();
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);

  const [friends, setFriends] = useState<User[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadComponent = async () => {
      setFriends(
        await getFriendsInCourse(
          context.friendIds,
          data.enrollment.courseId,
          getCurrentTermId()
        )
      );
      setLoading(false);
    };
    loadComponent();
  }, []);

  const handleDeleteEnrollment = async () => {
    setModalVisible(false);
    await deleteEnrollment(data.enrollment);

    let newEnrollments = context.enrollments.filter(
      (enrollment: Enrollment) =>
        enrollment.courseId !== data.enrollment.courseId ||
        enrollment.termId !== data.enrollment.termId
    );
    context.setEnrollments([...newEnrollments]);
    context.setUser(await getUser(context.user.id));

    refreshParent();
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
      {/* <CourseOverviewModal
        data={data}
        visible={modalVisible}
        setVisible={setModalVisible}
      /> */}
      <EnrollmentModal
        enrollment={data.enrollment}
        visible={modalVisible}
        setVisible={setModalVisible}
        editable
        deleteFunc={deleteEnrollmentAlert}
      />
      <Pressable
        style={[
          styles.container,
          { backgroundColor: data.enrollment.color || Colors.pink + "AA" },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.code}>
          {data.enrollment.code.join(", ")}{" "}
          {data.component && componentToName(data.component)}
        </Text>
        <Text style={{ marginTop: Layout.spacing.xxsmall }}>
          {getTimeString(data.startInfo)} - {getTimeString(data.endInfo)}
        </Text>
        {loading ? (
          <ActivityIndicator lightColor="transparent" darkColor="transparent" />
        ) : (
          <Text style={styles.classFriendsText}>
            {`${friends.length} Class Friend${friends.length === 1 ? "" : "s"}`}
          </Text>
        )}
        <View
          style={{
            backgroundColor: "transparent",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {/* TODO: only show a certain num of friends, then allow for showing more */}
          {/* Do this with friends.slice(0, num to show).map.... */}
          {friends.length > 0 &&
            friends.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.friendContainer,
                  { backgroundColor: Colors[colorScheme].background },
                ]}
              >
                <Pressable
                  key={item.id}
                  style={[AppStyles.row, { backgroundColor: "transparent" }]}
                  onPress={() =>
                    navigation.navigate("FriendProfile", { id: item.id })
                  }
                >
                  <ProfilePhoto
                    url={item.photoUrl}
                    size={Layout.photo.xsmall}
                  />
                  <View style={styles.friendNameWrap}>
                    <Text numberOfLines={1} style={styles.friendNameText}>
                      {item.name}
                    </Text>
                  </View>
                </Pressable>
              </View>
            ))}
        </View>
        {!loading && friends.length === 0 && (
          <View
            style={{
              marginTop: Layout.spacing.small,
              backgroundColor: "transparent",
            }}
          >
            <EmptyList primaryText="No friends in this class yet!" />
          </View>
        )}
        {/*TODO: allow for expanding nicely */}
        {/* {friends.length > 3 && (
          <Pressable onPress={() => setModalVisible(true)}>
            <Text
              style={{
                fontSize: Layout.text.small,
                alignSelf: "center",
                color: Colors[colorScheme].tint,
              }}
            >
              Show More
            </Text>
          </Pressable>
        )} */}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.boxShadow,
    paddingHorizontal: Layout.spacing.medium,
    paddingVertical: Layout.spacing.small,
    borderRadius: Layout.radius.large,
    marginVertical: Layout.spacing.small,
    width: "100%",
  },
  friendContainer: {
    ...AppStyles.boxShadow,
    paddingHorizontal: Layout.spacing.xsmall,
    paddingVertical: Layout.spacing.xsmall,
    borderRadius: Layout.radius.medium,
    marginVertical: Layout.spacing.xxsmall,
    width: "49%",
  },
  code: {
    fontSize: Layout.text.xlarge,
    fontWeight: "500",
  },
  schedText: {
    fontSize: Layout.text.medium,
    fontWeight: "500",
  },
  classFriendsText: {
    fontWeight: "500",
    marginTop: Layout.spacing.small,
    marginBottom: Layout.spacing.xsmall,
    alignSelf: "center",
  },
  friendNameWrap: {
    backgroundColor: "transparent",
    flexGrow: 1,
  },
  friendNameText: {
    fontSize: Layout.text.medium,
    paddingLeft: Layout.spacing.xsmall,
    width: 100,
  },
});
