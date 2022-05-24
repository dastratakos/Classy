import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Icon, View } from "./Themed";

import Colors from "../constants/Colors";
import ProfilePhotoModal from "./ProfilePhotoModal";
import useColorScheme from "../hooks/useColorScheme";
import { useState } from "react";

export default function ProfilePhoto({
  url,
  size,
  style,
  loading = false,
  withModal = false,
}: {
  url: string;
  size: number;
  style?: Object;
  loading?: boolean;
  withModal?: boolean;
}) {
  const colorScheme = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);

  if (loading || !url)
    return (
      <View
        style={[
          styles.placeholder,
          { height: size, width: size, borderRadius: size / 2 },
          { backgroundColor: Colors[colorScheme].photoBackground },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Icon
            name="user"
            size={size / 2}
            style={{ color: Colors[colorScheme].tertiaryBackground }}
          />
        )}
      </View>
    );

  if (withModal)
    return (
      <View>
        <ProfilePhotoModal
          url={url}
          visible={modalVisible}
          setVisible={setModalVisible}
        />
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          // style={styles.innerContainer}
        >
          <Image
            source={{ uri: url }}
            style={[
              { height: size, width: size, borderRadius: size / 2 },
              style,
            ]}
          />
        </TouchableOpacity>
      </View>
    );

  return (
    <Image
      source={{ uri: url }}
      style={[{ height: size, width: size, borderRadius: size / 2 }, style]}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
});
