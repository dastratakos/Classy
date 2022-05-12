import * as Haptics from "expo-haptics";

import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Enrollment, FriendProfileProps, User, WeekSchedule } from "../types";
import { Icon, Icon2, Text, View } from "../components/Themed";
import {
  acceptRequest,
  addFriend,
  blockUser,
  blockUserWithDoc,
  deleteFriendship,
  getFriendIds,
  getFriendStatus,
} from "../services/friends";
import {
  getCurrentTermId,
  getWeekFromEnrollments,
  sendPushNotification,
  termIdToFullName,
} from "../utils";
import { getEnrollmentsForTerm, getOverlap } from "../services/enrollments";
import { useContext, useEffect, useRef, useState } from "react";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Calendar from "../components/Calendar";
import Colors from "../constants/Colors";
import EnrollmentList from "../components/Lists/EnrollmentList";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import ProgressBar from "../components/ProgressBar";
import Separator from "../components/Separator";
import SquareButton from "../components/Buttons/SquareButton";
import TabView from "../components/TabView";
import { Timestamp } from "firebase/firestore";
import { getUser } from "../services/users";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function FriendProfile({ route }: FriendProfileProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [user, setUser] = useState<User>({} as User);
  const [friendStatus, setFriendStatus] = useState<string>("");
  const [friendDocId, setFriendDocId] = useState<string>("");
  const [friendStatusLoading, setFriendStatusLoading] = useState<boolean>(true);
  const [courseSimilarity, setCourseSimilarity] = useState<number>(0);
  const [overlap, setOverlap] = useState<Enrollment[]>([]);
  const [numFriends, setNumFriends] = useState<string>("");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [week, setWeek] = useState<WeekSchedule>([]);
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
    setUser(await getUser(route.params.id));

    const res = await getFriendStatus(context.user.id, route.params.id);
    setFriendStatus(res.friendStatus);
    setFriendDocId(res.friendDocId);
    setFriendStatusLoading(false);
    getFriendIds(route.params.id).then((res) => {
      setNumFriends(`${res.length}`);
    });

    const res2 = await getEnrollmentsForTerm(
      route.params.id,
      getCurrentTermId()
    );
    setEnrollments(res2);
    setWeek(getWeekFromEnrollments(res2));

    const res3 = await getOverlap(context.user.id, route.params.id);
    setCourseSimilarity(res3.courseSimilarity);
    setOverlap(res3.overlap);

    setInterval(checkInClass, 1000);
    setRefreshing(false);
  };

  const checkInClass = () => {
    const now = Timestamp.now().toDate();
    const today = now.getDay() - 1;

    if (!week[today]) {
      setInClass(false);
      return;
    }

    for (let event of week[today].events) {
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

  const handleAddFriend = async () => {
    setAddFriendDisabled(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setFriendStatus("request sent");
    setFriendDocId(await addFriend(context.user.id, user.id));

    sendPushNotification(
      user.expoPushToken,
      `${context.user.name} sent you a friend request`
    );
  };

  const handleAcceptRequest = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setFriendStatus("friends");
    acceptRequest(friendDocId);

    sendPushNotification(
      user.expoPushToken,
      `${context.user.name} accepted your friend request`
    );
  };

  const handleDeleteFriendship = async () => {
    setFriendStatus("not friends");
    setAddFriendDisabled(false);

    deleteFriendship(friendDocId);

    setFriendDocId("");
  };

  const handleBlockUser = async () => {
    setFriendStatus("block sent");

    if (friendDocId) blockUserWithDoc(context.user.id, user.id, friendDocId);
    else blockUser(context.user.id, user.id);
  };

  const cancelFriendRequestAlert = () =>
    Alert.alert("Cancel friend request", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: handleDeleteFriendship,
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
          onPress: handleDeleteFriendship,
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
          onPress: handleBlockUser,
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
          onPress: handleDeleteFriendship,
        },
      ]
    );

  const createDirectMessage = async (friendId: string) => {
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

    const channel = await createDirectMessage(user.id);
    context.setChannel(channel);
    context.setChannelName(channel.data.name);

    setMessageButtonLoading(false);
    navigation.navigate("HomeStack", {
      screen: "Messages",
      initial: false,
    });
    navigation.navigate("HomeStack", {
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
      component: <Calendar week={week} />,
    },
    {
      label: "Courses",
      component: <EnrollmentList enrollments={enrollments} />,
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
              size={Layout.photo.large}
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
                          onPress={handleAddFriend}
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
                          onPress={handleAcceptRequest}
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
                  <Icon2 name="pencil" size={Layout.icon.small} />
                </View>
                <Text style={styles.aboutText}>{user.major}</Text>
              </View>
            ) : null}
            {/* Graduation Year */}
            {user.gradYear ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon2 name="graduation" size={Layout.icon.small} />
                </View>
                <Text style={styles.aboutText}>{user.gradYear}</Text>
              </View>
            ) : null}
            {/* Interests */}
            {user.interests ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon2 name="puzzle" size={Layout.icon.small} />
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
        {!user.isPrivate || friendStatus === "friends" ? (
          <>
            <ProgressBar
              progress={courseSimilarity}
              text={`${Math.round(courseSimilarity)}% course similarity`}
              onPress={() =>
                navigation.navigate("CourseSimilarity", {
                  courseSimilarity,
                  overlap,
                })
              }
              containerStyle={{ marginTop: Layout.spacing.medium }}
            />
            <View style={[AppStyles.row, { marginTop: Layout.spacing.medium }]}>
              <Text style={styles.term}>
                {termIdToFullName(getCurrentTermId())}
              </Text>
              <Button
                text="View All Quarters"
                onPress={() => navigation.navigate("Quarters", { user })}
              />
            </View>
          </>
        ) : null}
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
          <TabView tabs={tabs} selectedStyle={{ backgroundColor: Colors.pink }}/>
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
    marginBottom: Layout.spacing.xsmall,
  },
  term: {
    fontSize: Layout.text.large,
    fontWeight: "500",
  },
});
