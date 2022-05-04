import { Course, FriendProfileProps, User } from "../types";
import { Icon, Text, View } from "../components/Themed";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  limit,
} from "firebase/firestore";
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
import { StreamChat } from "stream-chat";
import TabView from "../components/TabView";
import { db } from "../firebase";
import events from "./dummyEvents";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

const STREAM_API_KEY = "y9tk9hsvsxqa";
const client = StreamChat.getInstance(STREAM_API_KEY);

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

  const actionSheetRef = useRef();

  const baseActionSheetOptions = ["Block", "Copy profile URL", "Cancel"];

  const friendActionSheetOptions = [
    "Block",
    "Remove friend",
    "Copy profile URL",
    "Cancel",
  ];

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
    getCourses(route.params.id);
    setInterval(checkInClass, 1000);
    setRefreshing(false);
  };

  const getCourses = async (id: string) => {
    // TODO: use id to query for specific courses
    const q = query(collection(db, "courses"), limit(5));

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

    const querySnapshot = await getDocs(q);
    // TODO: check that this has 0 or 1 doc
    querySnapshot.forEach((doc) => {
      console.log("doc.data():", doc.data());
      setFriendDocId(doc.id);

      if (doc.data().status === "requested") {
        console.log("hi,", doc.data().requesterId[context.user.id]);
        if (doc.data().requesterId[context.user.id])
          setFriendStatus("request sent");
        else setFriendStatus("request received");
      } else {
        setFriendStatus(doc.data().status);
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

  const sendPushNotification = async (
    expoPushToken: string,
    body: string = ""
  ) => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Classy",
      body: body,
      data: {},
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
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

    if (user.expoPushToken)
      sendPushNotification(
        user.expoPushToken,
        `${context.user.name} sent you a friend request`
      );

    console.log("Friend request send with ID:", docRef.id);
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

    const channel = client.channel("messaging", channelId, {
      name: "Direct Message",
      members: [context.user.id, friendId],
    });

    await channel.watch();

    return channel;
  };

  const handleMessagePressed = async () => {
    const channel = await watchChannel(user.id);
    context.setChannel(channel);
    context.setChannelName(channel.data.name);

    navigation.navigate("MessagesStack", {
      screen: "ChannelScreen",
      initial: false,
    });
  };

  const handleActionSheetOptionPressed = (index: number) => {
    if (friendStatus === "friends") {
      console.log(friendActionSheetOptions[index], "pressed");
    } else {
      console.log(baseActionSheetOptions[index], "pressed");
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
                      text="Loading"
                      onPress={() => console.log("Loading pressed")}
                      pressable={false}
                    />
                  </View>
                ) : (
                  <>
                    {friendStatus === "not friends" && (
                      <View style={{ marginRight: Layout.spacing.small }}>
                        <Button text="Add Friend" onPress={addFriend} />
                      </View>
                    )}
                    {friendStatus === "request sent" && (
                      <View style={{ marginRight: Layout.spacing.small }}>
                        <Button
                          text="Requested"
                          onPress={() => console.log("Requested pressed")}
                          pressable={false}
                        />
                      </View>
                    )}
                    {friendStatus === "request received" && (
                      <View style={{ marginRight: Layout.spacing.small }}>
                        <Button text="Accept request" onPress={acceptRequest} />
                      </View>
                    )}
                  </>
                )}
                <Button text="Message" onPress={handleMessagePressed} />
                <Pressable
                  onPress={() => actionSheetRef.current?.show()}
                  style={({ pressed }) => [
                    styles.ellipsis,
                    { opacity: pressed ? 0.5 : 1 },
                    { borderColor: Colors[colorScheme].text },
                  ]}
                >
                  <Icon name="ellipsis-h" size={25} />
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
                  <Icon name="pencil" size={25} />
                </View>
                <Text style={styles.aboutText}>{user.major}</Text>
              </View>
            ) : null}
            {/* Graduation Year */}
            {user.gradYear ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon name="graduation-cap" size={25} />
                </View>
                <Text style={styles.aboutText}>{user.gradYear}</Text>
              </View>
            ) : null}
            {/* Interests */}
            {user.interests ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon name="puzzle-piece" size={25} />
                </View>
                <Text style={styles.aboutText}>{user.interests}</Text>
              </View>
            ) : null}
          </View>
          <SquareButton
            num={numFriends}
            text={"friend" + (numFriends === "1" ? "" : "s")}
            onPress={() =>
              navigation.navigate("Friends", { id: route.params.id })
            }
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
              },
              styles.similarityContainer,
              { borderColor: Colors[colorScheme].text },
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
            : baseActionSheetOptions
        }
        cancelButtonIndex={
          friendStatus === "friends"
            ? friendActionSheetOptions.length - 1
            : baseActionSheetOptions.length - 1
        }
        destructiveButtonIndex={0}
        onPress={handleActionSheetOptionPressed}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    marginLeft: Layout.spacing.small,
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    borderWidth: 1,
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
    borderWidth: 1,
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
