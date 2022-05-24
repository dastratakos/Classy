import { Image, StyleSheet } from "react-native";

import Layout from "../constants/Layout";
import Modal from "react-native-modal";

export default function ProfilePhotoModal({
  url,
  visible,
  setVisible,
}: {
  url: string;
  visible: boolean;
  setVisible: (arg0: boolean) => void;
}) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => setVisible(false)}
      style={{ margin: 0 }}
    >
      <Image source={{ uri: url }} style={styles.image} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  image: {
    height: Layout.window.width,
    width: Layout.window.width,
    resizeMode: "contain",
  },
});
