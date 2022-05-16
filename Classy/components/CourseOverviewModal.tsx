import { Enrollment, User } from "../types";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import { componentToName, getTimeString } from "../utils";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import Modal from "react-native-modal";
import ProfilePhoto from "../components/ProfilePhoto";
import { Timestamp } from "firebase/firestore";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function CourseOverviewModal({
  enrollment,
  friends,
  startInfo,
  endInfo,
  component,
  visible,
  setVisible,
}: {
  enrollment: Enrollment;
  friends: User[];
  startInfo: Timestamp;
  endInfo: Timestamp;
  component: string;
  visible: boolean;
  setVisible: (arg0: boolean) => void;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <Modal isVisible={visible}>
      <Pressable style={[styles.container]} onPress={() => setVisible(false)}>
        <Pressable
          style={[
            styles.modalView,
            { backgroundColor: Colors[colorScheme].secondaryBackground },
            { maxHeight: "50%" },
          ]}
        >
          <Text style={styles.code}>
            {enrollment.code.join(", ")}{" "}
            {component && componentToName(component)}
          </Text>
          <Text style={{ marginTop: Layout.spacing.xxsmall }}>
            {/* TODO: AFRICA IS BECAUSE OF TIMEZONE ERROR IN FIRESTORE DATABASE */}
            {getTimeString(startInfo, "Africa/Casablanca")} -{" "}
            {getTimeString(endInfo, "America/Danmarkshavn")}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              marginTop: Layout.spacing.small,
              alignSelf: "center",
            }}
          >
            Class Friends ({friends.length})
          </Text>

          <View
            style={{
              maxHeight: "80%",
              width: "100%",
              backgroundColor: Colors[colorScheme].secondaryBackground,
            }}
          >
            <FlatList
              data={friends}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.friendContainer,
                    AppStyles.boxShadow,
                    { backgroundColor: Colors[colorScheme].background },
                  ]}
                >
                  <Pressable
                    style={[AppStyles.row, { backgroundColor: "transparent" }]}
                    onPress={() => {
                      navigation.navigate("FriendProfile", { id: item.id });
                      setVisible(false);
                    }}
                  >
                    <ProfilePhoto
                      url={item.photoUrl}
                      size={Layout.photo.xsmall}
                    />
                    <View
                      style={{
                        backgroundColor: "transparent",
                        flexGrow: 1,
                      }}
                    >
                      <Text style={{ fontSize: Layout.text.large }}>
                        {" "}
                        {item.name}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              )}
              keyExtractor={(item) => `${item.id}`}
              style={{ flexGrow: 0 }}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  friendContainer: {
    paddingHorizontal: Layout.spacing.xsmall,
    paddingVertical: Layout.spacing.xsmall,
    borderRadius: Layout.radius.medium,
    marginVertical: Layout.spacing.small,
    alignSelf: "center",
    width: "97%",
  },
  modalView: {
    ...AppStyles.boxShadow,
    margin: Layout.spacing.xxsmall,
    borderRadius: Layout.radius.large,
    padding: Layout.spacing.large,
  },
  code: {
    fontSize: Layout.text.xlarge,
  },
  schedText: {
    fontSize: Layout.text.large,
    fontWeight: "500",
  },
});