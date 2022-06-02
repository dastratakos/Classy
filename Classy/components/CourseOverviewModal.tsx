import { FlatList, Pressable, StyleSheet } from "react-native";
import { FontAwesome, Text, View } from "./Themed";
import { componentToName, getTimeString } from "../utils";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import { CourseOverview } from "../types";
import Layout from "../constants/Layout";
import Modal from "react-native-modal";
import ProfilePhoto from "../components/ProfilePhoto";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function CourseOverviewModal({
  data,
  visible,
  setVisible,
}: {
  data: CourseOverview;
  visible: boolean;
  setVisible: (arg0: boolean) => void;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <Modal isVisible={visible} onBackdropPress={() => setVisible(false)}>
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].secondaryBackground },
          { maxHeight: "50%" },
        ]}
      >
        <Text style={styles.code}>
          {data.enrollment.code.join(", ")}{" "}
          {data.component && componentToName(data.component)}
        </Text>
        <Text style={{ marginTop: Layout.spacing.xxsmall }}>
          {getTimeString(data.startInfo)} - {getTimeString(data.endInfo)}
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            marginTop: Layout.spacing.small,
            alignSelf: "center",
          }}
        >
          Class Friends ({data.friends.length})
        </Text>

        <View
          style={{
            maxHeight: "80%",
            width: "100%",
            backgroundColor: Colors[colorScheme].secondaryBackground,
          }}
        >
          <FlatList
            data={data.friends}
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
            keyExtractor={(item) => item.id.toString()}
            style={{ flexGrow: 0 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.boxShadow,
    margin: Layout.spacing.xxsmall,
    borderRadius: Layout.radius.large,
    padding: Layout.spacing.large,
  },
  titleRow: {
    ...AppStyles.row,
    backgroundColor: "transparent",
    alignItems: "flex-start",
  },
  friendContainer: {
    paddingHorizontal: Layout.spacing.xsmall,
    paddingVertical: Layout.spacing.xsmall,
    borderRadius: Layout.radius.medium,
    marginVertical: Layout.spacing.small,
    alignSelf: "center",
    width: "97%",
  },
  code: {
    fontSize: Layout.text.xlarge,
  },
  schedText: {
    fontSize: Layout.text.large,
    fontWeight: "500",
  },
});
