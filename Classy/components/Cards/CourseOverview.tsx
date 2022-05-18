import { Pressable, StyleSheet, Alert } from "react-native";
import { Text, View } from "../Themed";
import { componentToName, getTimeString } from "../../utils";

import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import CourseOverviewModal from "../CourseOverviewModal";
import { CourseOverview as CourseOverviewType } from "../../types";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { useState } from "react";
import EmptyList from "../EmptyList";
import EnrollmentModal from "../EnrollmentModal";
import { deleteEnrollment } from "../../services/enrollments";

export default function CourseOverview({ data }: { data: CourseOverviewType }) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);

  let midway = data.friends.length / 2;
  if (data.friends.length % 2 !== 0) {
    midway++;
  }

  const handleDeleteEnrollment = async () => {
    setModalVisible(false);
    await deleteEnrollment(data.enrollment);
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
          { backgroundColor: (data.enrollment.color || Colors.pink) + "AA" },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.code}>
          {data.enrollment.code.join(", ")}{" "}
          {data.component && componentToName(data.component)}
        </Text>
        <Text style={{ marginTop: Layout.spacing.xxsmall }}>
          {/* TODO: AFRICA IS BECAUSE OF TIMEZONE ERROR IN FIRESTORE DATABASE */}
          {getTimeString(data.startInfo, "Africa/Casablanca")} -{" "}
          {getTimeString(data.endInfo, "America/Danmarkshavn")}
        </Text>
        <Text style={styles.classFriendsText}>
          {data.friends.length} Class Friends
        </Text>
        <View
          style={{
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {/*ToDO : only show a certain num of friends, then allow for showing more*/}
          {/*Do this with data.friends.slice(0, num to show).map.... */}
          <View style={styles.friendColumnContainer}>
            {data.friends.length > 0 &&
              data.friends.slice(0, midway).map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.friendContainer,
                    AppStyles.boxShadow,
                    {
                      backgroundColor: Colors[colorScheme].background,
                    },
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
          {/*second half of friends */}
          <View style={styles.friendColumnContainer}>
            {data.friends.length > 0 &&
              data.friends.slice(midway).map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.friendContainer,
                    AppStyles.boxShadow,
                    {
                      backgroundColor: Colors[colorScheme].background,
                    },
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
        </View>
        {data.friends.length === 0 && (
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
        {/* {data.friends.length > 3 && (
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
    paddingHorizontal: Layout.spacing.medium,
    paddingVertical: Layout.spacing.small,
    borderRadius: Layout.radius.large,
    marginVertical: Layout.spacing.small,
    width: "100%",
  },
  friendContainer: {
    paddingHorizontal: Layout.spacing.xsmall,
    paddingVertical: Layout.spacing.xsmall,
    borderRadius: Layout.radius.medium,
    marginVertical: Layout.spacing.xxsmall,
    width: "100%",
  },
  code: {
    fontSize: Layout.text.xlarge,
    fontWeight: "500",
  },
  schedText: {
    fontSize: Layout.text.medium,
    fontWeight: "500",
  },
  friendColumnContainer: {
    backgroundColor: "transparent",
    width: "48%",
  },
  classFriendsText: {
    fontWeight: "bold",
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
