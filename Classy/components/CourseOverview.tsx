import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "./Themed";

import Layout from "../constants/Layout";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";
import { User } from "../types";
import AppStyles from "../styles/AppStyles";
import { useState } from "react";

import CourseOverviewModal from "./CourseOverviewModal";
import ProfilePhoto from "../components/ProfilePhoto";

export default function CourseOverview({
  key,
  code,
  time,
  friends,
}: {
  key: string;
  code: string;
  time: string;
  friends: User[];
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View key={key}>
      <CourseOverviewModal
        code={code}
        time={time}
        friends={friends}
        visible={modalVisible}
        setVisible={setModalVisible}
      />
      <View
        style={[
          styles.container,
          AppStyles.boxShadow,
        ]}
      >
        <Text>{code}</Text>
        <Text>{time}</Text>
        <Text>Class Friends</Text>
        <View>
          {
            friends.slice(0, 3).map((item) => (
              <View key={item.id} style={AppStyles.row}>
                <Pressable
                  onPress={() => navigation.navigate("FriendProfile", { id: item.id })}
                >
                  <View style={[AppStyles.row, { flex: 1 }]}>
                    <ProfilePhoto
                          url={item.photoUrl}
                          size={Layout.photo.small}
                        />
                    <View style={{ flexGrow: 1 }}>
                      <Text> {item.name}</Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            ))
          }
        </View>
        {friends.length > 3 &&
          <Pressable
            onPress={() => setModalVisible(true)}
          >
            <Text>Show More</Text>
          </Pressable>
        }
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
  }
});
