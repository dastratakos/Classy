import * as Haptics from "expo-haptics";

import { ActivityIndicator, Icon, Text, View } from "../components/Themed";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Course, FriendProfileProps, User } from "../types";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getCurrentTermId, sendPushNotification } from "../utils";
import { useContext, useEffect, useRef, useState } from "react";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Calendar from "../components/Calendar";
import Colors from "../constants/Colors";
import CourseList from "../components/CourseList";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import Separator from "../components/Separator";
import SquareButton from "../components/Buttons/SquareButton";
import TabView from "../components/TabView";
import { db } from "../firebase";
import events from "./dummyEvents";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function FriendProfile({ route }: FriendProfileProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [user, setUser] = useState({} as User);
  const [friendStatus, setFriendStatus] = useState("");
  const [friendDocId, setFriendDocId] = useState("");
  const [friendStatusLoading, setFriendStatusLoading] = useState(true);
  const [numFriends, setNumFriends] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [inClass, setInClass] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState(false);
  const [messageButtonLoading, setMessageButtonLoading] = useState(false);
  const [addFriendDisabled, setAddFriendDisabled] = useState(false);

  const actionSheetRef = useRef();

  const baseActionSheetOptions = ["Block", "Copy profile URL", "Cancel"];

  const friendActionSheetOptions = [
    "Block",
    "Remove friend",
    "Copy profile URL",
    "Cancel",
  ];

  const blockedActionSheetOptions = ["Unblock", "Copy profile URL", "Cancel"];

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    getUser(route.params.id);
    getFriendStatus(route.params.id);
    getFriendIds(route.params.id).then((res) => {
      setNumFriends(`${res.length}`);
    });
    getCoursesForTerm(route.params.id, getCurrentTermId());
    setInterval(checkInClass, 1000);
    setRefreshing(false);
  };

  const getCoursesForTerm = async (id: string, termId: string) => {
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", id),
      where("termId", "==", termId),
      orderBy("code")
    );

    const results = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });
    setCourses(results);
  };

  const getUser = async (id: string) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data() as User);
    } else {
      console.log(`Could not find user: ${id}`);
      alert("This account does not exist.");
    }
  };

  const getFriendStatus = async (id: string) => {
    /**
     * Possible friend statuses:
     *   - not friends
     *   - request sent (you sent this friend a request)
     *   - request received (you received a request from this friend)
     *   - friends
     */
    setFriendStatusLoading(true);

    const q = query(
      collection(db, "friends"),
      where(`ids.${id}`, "==", true),
      where(`ids.${context.user.id}`, "==", true)
    );

    // default status
    setFriendStatus("not friends");
    setFriendDocId("");

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((res) => {
      /* Delete any extra friendship documents. */
      if (friendStatus !== "not friends") {
        deleteDoc(doc(db, "friends", res.id));
        return;
      }

      console.log("friendship:", res.data());
      setFriendDocId(res.id);

      if (res.data().status === "requested") {
        if (res.data().requesterId[context.user.id])
          setFriendStatus("request sent");
        else setFriendStatus("request received");
      } else if (res.data().status === "blocked") {
        if (res.data().requesterId[context.user.id])
          setFriendStatus("block sent");
        else setFriendStatus("block received");
      } else {
        setFriendStatus(res.data().status);
      }
    });

    setFriendStatusLoading(false);
  };

  const getFriendIds = async (id: string) => {
    const q = query(
      collection(db, "friends"),
      where(`ids.${id}`, "==", true),
      where("status", "==", "friends")
    );
    const friendIds = [] as string[];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      for (let key in doc.data().ids) {
        if (key !== id) {
          friendIds.push(key);
          return;
        }
      }
    });
    return friendIds;
  };

  const checkInClass = () => {
    const now = Timestamp.now().toDate();
    const today = now.getDay() - 1;

    if (!events[today]) {
      setInClass(false);
      return;
    }

    for (let event of events[today].events) {
      const startInfo = event.startInfo.toDate();
      var startTime = new Date();
      startTime.setHours(startInfo.getHours());
      startTime.setMinutes(startInfo.getMinutes());

      const endInfo = event.endInfo.toDate();
      var endTime = new Date();
      endTime.setHours(endInfo.getHours());
      endTime.setMinutes(endInfo.getMinutes());

      if (startTime <= now && endTime >= now) {
        setInClass(true);
        return;
      }
    }
    setInClass(false);
  };

  const addFriend = async () => {
    const userId = context.user.id;
    const friendId = user.id;

    const docRef = await addDoc(collection(db, "friends"), {
      ids: {
        [userId]: true,
        [friendId]: true,
      },
      requesterId: {
        [userId]: true,
        [friendId]: false,
      },
      status: "requested",
    });

    setFriendStatus("request sent");
    console.log("Friend request send with ID:", docRef.id);
    setFriendDocId(docRef.id);

    if (user.expoPushToken)
      sendPushNotification(
        user.expoPushToken,
        `${context.user.name} sent you a friend request`
      );
  };

  const acceptRequest = async () => {
    const docRef = doc(db, "friends", friendDocId);
    await updateDoc(docRef, { status: "friends" });

    setFriendStatus("friends");

    if (user.expoPushToken)
      sendPushNotification(
        user.expoPushToken,
        `${context.user.name} accepted your friend request`
      );
  };

  const deleteFriendship = async () => {
    setFriendStatus("not friends");

    const docRef = doc(db, "friends", friendDocId);
    await deleteDoc(docRef);

    setFriendDocId("");
  };

  const blockUser = async () => {
    setFriendStatus("block sent");

    const userId = context.user.id;
    const friendId = user.id;

    if (friendDocId) {
      const docRef = doc(db, "friends", friendDocId);

      await updateDoc(docRef, {
        requesterId: {
          [userId]: true,
          [friendId]: false,
        },
        status: "blocked",
      });
    } else {
      const docRef = await addDoc(collection(db, "friends"), {
        ids: {
          [userId]: true,
          [friendId]: true,
        },
        requesterId: {
          [userId]: true,
          [friendId]: false,
        },
        status: "blocked",
      });

      setFriendDocId(docRef.id);
      console.log("User blocked with doc ID:", docRef.id);
    }
  };

  const cancelFriendRequestAlert = () =>
    Alert.alert("Cancel friend request", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: deleteFriendship,
      },
    ]);

  const removeFriendAlert = () =>
    Alert.alert(
      "Remove friend",
      `Are you sure? You will have to request ${user.name} again.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: deleteFriendship,
        },
      ]
    );

  const blockAlert = () =>
    Alert.alert(
      "Block user",
      `${user.name} will no longer be able to see your profile, send you a friend request, or message you.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: blockUser,
        },
      ]
    );

  const unblockAlert = () =>
    Alert.alert(
      "Unblock user",
      `${user.name} will be able to see your profile, send you a friend request, and message you.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: deleteFriendship,
        },
      ]
    );

  const watchChannel = async (friendId: string) => {
    /**
     * The channelId for a direct message between two people is their user IDs
     * separated by hyphens. The one that comes first alphabetically will be
     * listed first.
     */
    let channelId;
    if (friendId < context.user.id)
      channelId = `${friendId}-${context.user.id}`;
    else channelId = `${context.user.id}-${friendId}`;

    const channel = context.streamClient.channel("messaging", channelId, {
      name: "Direct Message",
      members: [context.user.id, friendId],
    });

    await channel.watch();

    return channel;
  };

  const handleMessagePressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setMessageButtonLoading(true);

    const channel = await watchChannel(user.id);
    context.setChannel(channel);
    context.setChannelName(channel.data.name);

    setMessageButtonLoading(false);
    navigation.navigate("MessagesStack", {
      screen: "ChannelScreen",
      initial: false,
    });
  };

  const handleActionSheetOptionPressed = (index: number) => {
    if (friendStatus === "friends") {
      const action = friendActionSheetOptions[index];
      if (action === "Block") {
        blockAlert();
      } else if (action === "Remove friend") {
        removeFriendAlert();
      } else if (action === "Copy profile URL") {
        console.log("Copy profile URL pressed");
      }
    } else if (friendStatus === "block sent") {
      const action = blockedActionSheetOptions[index];
      if (action === "Unblock") {
        unblockAlert();
      } else if (action === "Copy profile URL") {
        console.log("Copy profile URL pressed");
      }
    } else {
      const action = baseActionSheetOptions[index];
      if (action === "Block") {
        blockAlert();
      } else if (action === "Copy profile URL") {
        console.log("Copy profile URL pressed");
      }
    }
  };

  const tabs = [
    {
      label: "Calendar",
      component: <Calendar events={events} />,
    },
    {
      label: "Courses",
      component: <CourseList courses={courses} />,
    },
  ];

  if (friendStatus === "block received") {
    return (
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{ alignItems: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.notFoundContainer}>
          <Text style={styles.uhOhText}>Uh oh!</Text>
          <Text>User not found</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={AppStyles.section}>
        <View style={AppStyles.row}>
          <View style={[AppStyles.row, { flex: 1 }]}>
            <ProfilePhoto
              url={user.photoUrl}
              size={Layout.photo.medium}
              style={{ marginRight: Layout.spacing.large }}
            />
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.name}>{user.name}</Text>
              <View
                style={[
                  AppStyles.row,
                  { marginVertical: Layout.spacing.xsmall },
                ]}
              >
                <View
                  style={[
                    styles.status,
                    inClass ? styles.inClass : styles.notInClass,
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: Colors[colorScheme].secondaryText },
                  ]}
                >
                  {inClass ? "In class" : "Not in class"}
                </Text>
              </View>
              <View style={[AppStyles.row, { justifyContent: "flex-start" }]}>
                {friendStatusLoading ? (
                  <View style={{ marginRight: Layout.spacing.small }}>
                    <Button
                      onPress={() => console.log("Loading pressed")}
                      loading
                    />
                  </View>
                ) : (
                  <>
                    {friendStatus === "not friends" && (
                      <View style={{ marginRight: Layout.spacing.small }}>
                        <Button
                          text="Add Friend"
                          onPress={() => {
                            setAddFriendDisabled(true);
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Medium
                            );
                            addFriend();
                          }}
                          disabled={addFriendDisabled}
                          emphasized
                        />
                      </View>
                    )}
                    {friendStatus === "request sent" && (
                      <View style={{ marginRight: Layout.spacing.small }}>
                        <Button
                          text="Requested"
                          onPress={cancelFriendRequestAlert}
                        />
                      </View>
                    )}
                    {friendStatus === "request received" && (
                      <View style={{ marginRight: Layout.spacing.small }}>
                        <Button
                          text="Accept request"
                          onPress={() => {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Medium
                            );
                            acceptRequest();
                          }}
                          emphasized
                        />
                      </View>
                    )}
                  </>
                )}
                <Button
                  text="Message"
                  onPress={handleMessagePressed}
                  loading={messageButtonLoading}
                />
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    actionSheetRef.current?.show();
                  }}
                  style={({ pressed }) => [
                    styles.ellipsis,
                    { opacity: pressed ? 0.5 : 1 },
                    { backgroundColor: Colors[colorScheme].cardBackground },
                  ]}
                >
                  <Icon name="ellipsis-h" size={Layout.icon.medium} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <View style={[AppStyles.row, { marginTop: 15 }]}>
          <View style={{ flex: 1, marginRight: Layout.spacing.small }}>
            {/* Major */}
            {user.major ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon name="pencil" size={Layout.icon.medium} />
                </View>
                <Text style={styles.aboutText}>{user.major}</Text>
              </View>
            ) : null}
            {/* Graduation Year */}
            {user.gradYear ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon name="graduation-cap" size={Layout.icon.medium} />
                </View>
                <Text style={styles.aboutText}>{user.gradYear}</Text>
              </View>
            ) : null}
            {/* Interests */}
            {user.interests ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon name="puzzle-piece" size={Layout.icon.medium} />
                </View>
                <Text style={styles.aboutText}>{user.interests}</Text>
              </View>
            ) : null}
          </View>
          <SquareButton
            num={numFriends}
            text={"friend" + (numFriends === "1" ? "" : "s")}
            size={Layout.buttonHeight.large}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("Friends", { id: route.params.id });
            }}
          />
        </View>
        {user.isPrivate && !(friendStatus === "friends") ? null : (
          <Pressable
            onPress={() =>
              navigation.navigate("CourseSimilarity", { id: route.params.id })
            }
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1,
                backgroundColor: Colors[colorScheme].cardBackground,
              },
              AppStyles.boxShadow,
              styles.similarityContainer,
            ]}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.similarityBar,
                {
                  backgroundColor: Colors[colorScheme].photoBackground,
                  width: `${57.54}%`,
                },
              ]}
            />
            <Text style={styles.similarityText}>
              {Math.round(57.54)}% course similarity
            </Text>
          </Pressable>
        )}
      </View>
      <Separator />
      {user.isPrivate && !(friendStatus === "friends") ? (
        <View
          style={{ alignItems: "center", marginTop: Layout.spacing.xxxlarge }}
        >
          <Icon name="lock" size={100} />
          <Text>This user is private</Text>
        </View>
      ) : (
        <View style={AppStyles.section}>
          <TabView tabs={tabs} />
        </View>
      )}
      <ActionSheet
        ref={actionSheetRef}
        options={
          friendStatus === "friends"
            ? friendActionSheetOptions
            : friendStatus === "block sent"
            ? blockedActionSheetOptions
            : baseActionSheetOptions
        }
        cancelButtonIndex={
          friendStatus === "friends"
            ? friendActionSheetOptions.length - 1
            : friendStatus === "block sent"
            ? blockedActionSheetOptions.length - 1
            : baseActionSheetOptions.length - 1
        }
        destructiveButtonIndex={0}
        onPress={handleActionSheetOptionPressed}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    marginTop: Layout.window.width / 3,
    alignItems: "center",
    justifyContent: "center",
  },
  uhOhText: {
    fontSize: Layout.text.xxlarge,
    fontWeight: "500",
    marginBottom: Layout.spacing.small,
  },
  name: {
    fontSize: Layout.text.xlarge,
  },
  status: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
  },
  inClass: {
    backgroundColor: Colors.status.inClass,
  },
  notInClass: {
    backgroundColor: Colors.status.notInClass,
  },
  statusText: {
    marginLeft: Layout.spacing.small,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  ellipsis: {
    ...AppStyles.boxShadow,
    marginLeft: Layout.spacing.small,
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  aboutText: {
    flex: 1,
  },
  iconWrapper: {
    width: 30,
    marginRight: 15,
    alignItems: "center",
  },
  similarityContainer: {
    borderRadius: Layout.radius.small,
    paddingVertical: Layout.spacing.small,
    marginTop: Layout.spacing.medium,
  },
  similarityBar: {
    borderRadius: Layout.radius.small,
  },
  similarityText: {
    alignSelf: "center",
  },
});
