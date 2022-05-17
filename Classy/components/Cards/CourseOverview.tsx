import { Pressable, StyleSheet } from "react-native";
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

export default function CourseOverview({
  key,
  data,
}: {
  key: string;
  data: CourseOverviewType;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View key={key}>
      <CourseOverviewModal
        data={data}
        visible={modalVisible}
        setVisible={setModalVisible}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: data.enrollment.color || Colors.pink },
        ]}
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
        <Text
          style={{
            fontWeight: "bold",
            marginTop: Layout.spacing.small,
            alignSelf: "center",
          }}
        >
          Class Friends ({data.friends.length})
        </Text>
        <View style={{ backgroundColor: "transparent" }}>
          {data.friends.length > 0 &&
            data.friends.slice(0, 3).map((item) => (
              <View
                key={item.id}
                style={[
                  styles.friendContainer,
                  AppStyles.boxShadow,
                  { backgroundColor: Colors[colorScheme].secondaryBackground },
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
            ))}
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
        </View>
        {data.friends.length > 3 && (
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
        )}
      </View>
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
});
