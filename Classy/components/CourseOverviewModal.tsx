import { Pressable, StyleSheet, FlatList } from "react-native";
import Modal from "react-native-modal";
import { Text, View } from "./Themed";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";
import { User } from "../types";
import AppStyles from "../styles/AppStyles";
import ProfilePhoto from "../components/ProfilePhoto";

export default function CourseOverviewModal({
  code,
  time,
  friends,
  visible,
  setVisible,
}: {
  code: string;
  time: string;
  friends: User[];
  visible: boolean;
  setVisible: (arg0: boolean) => void;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <Modal
      isVisible={visible}
    >
      <Pressable style={[styles.container]} onPress={() => setVisible(false)}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: Colors[colorScheme].cardBackground },
            { maxHeight:"50%" }
          ]}
        >
          <Text>{code}</Text>
          <Text>{time}</Text>
          <Text>Class Friends</Text>
          <View style={{ maxHeight:"85%", width:"100%" }}>
            <FlatList
              data={friends}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => { navigation.navigate("FriendProfile", { id: item.id }); setVisible(false); }}
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
              )}
              keyExtractor={(item) => `${item.id}`}
              style={{ flexGrow: 0 }}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    ...AppStyles.boxShadow,
    margin: Layout.spacing.large,
    borderRadius: Layout.radius.large,
    padding: Layout.spacing.large,
    alignItems: "center",
  },
});
