import * as Haptics from "expo-haptics";

import {
  ActivityIndicator,
  FontAwesome,
  SimpleLineIcons,
  Text,
  View,
} from "../components/Themed";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Degree,
  Enrollment,
  FriendProfileProps,
  User,
  WeekSchedule,
} from "../types";
import {
  acceptRequest,
  addFriend,
  blockUser,
  blockUserWithDoc,
  deleteFriendship,
  getFriendIds,
  getFriendStatus,
  getNumFriendsInCourse,
} from "../services/friends";
import {
  addNotification,
  deleteFriendshipNotifications,
} from "../services/notifications";
import {
  getCurrentTermId,
  getWeekFromEnrollments,
  sendPushNotification,
  termIdToFullName,
  termIdToQuarterName,
  timeIsEarlier,
} from "../utils";
import { useContext, useEffect, useRef, useState } from "react";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Calendar from "../components/Calendar/Calendar";
import Colors from "../constants/Colors";
import EmptyList from "../components/EmptyList";
import EnrollmentList from "../components/Lists/EnrollmentList";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import ProgressBar from "../components/ProgressBar";
import SVGAutumn from "../assets/images/undraw/autumn.svg";
import SVGNoCourses from "../assets/images/undraw/noCourses.svg";
import SVGPrivate from "../assets/images/undraw/private.svg";
import SVGSpring from "../assets/images/undraw/spring.svg";
import SVGSummer from "../assets/images/undraw/summer.svg";
import SVGWinter from "../assets/images/undraw/winter.svg";
import Separator from "../components/Separator";
import SquareButton from "../components/Buttons/SquareButton";
import TabView from "../components/TabView";
import { Timestamp } from "firebase/firestore";
import { getEnrollments } from "../services/enrollments";
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
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [currentEnrollments, setCurrentEnrollments] = useState<Enrollment[]>(
    []
  );
  const [quarterName, setQuarterName] = useState<string>("");
  const [weekRes, setWeekRes] = useState<{
    week: WeekSchedule;
    startCalendarHour: number;
    endCalendarHour: number;
  }>({ week: [], startCalendarHour: 8, endCalendarHour: 6 });
  const [inClass, setInClass] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [messageButtonLoading, setMessageButtonLoading] =
    useState<boolean>(false);
  const [addFriendDisabled, setAddFriendDisabled] = useState<boolean>(false);

  const [enrollmentsLoading, setEnrollmentsLoading] = useState<boolean>(true);

  const actionSheetRef = useRef();

  const baseActionSheetOptions = ["Block", "Cancel"];

  const friendActionSheetOptions = ["Block", "Remove friend", "Cancel"];

  const blockedActionSheetOptions = ["Unblock", "Cancel"];

  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    const interval = setInterval(checkInClass, 1000);
    return () => clearInterval(interval);
  }, [weekRes]);

  const onRefresh = async () => {
    setRefreshing(true);
    setUser(await getUser(route.params.id));

    setQuarterName(termIdToQuarterName(getCurrentTermId()));

    /* Get friend status. */
    const res = await getFriendStatus(context.user.id, route.params.id);
    setFriendStatus(res.friendStatus);
    setFriendDocId(res.friendDocId);
    setFriendStatusLoading(false);
    getFriendIds(route.params.id).then((res) => setFriendIds(res));

    /* Get enrollments. */
    setEnrollmentsLoading(true);

    const friendEnrollments = await getEnrollments(route.params.id);

    /* Get numFriends only for current enrollments. */
    for (let i = 0; i < friendEnrollments.length; i++) {
      const enrollment = friendEnrollments[i];
      if (enrollment.termId !== getCurrentTermId()) continue;

      friendEnrollments[i].numFriends = await getNumFriendsInCourse(
        enrollment.courseId,
        context.friendIds,
        enrollment.termId
      );
    }

    setEnrollments(friendEnrollments);
    const currentEnrollments = friendEnrollments.filter(
      (enrollment: Enrollment) => enrollment.termId === getCurrentTermId()
    );
    setCurrentEnrollments(currentEnrollments);
    setWeekRes(getWeekFromEnrollments(currentEnrollments));

    setEnrollmentsLoading(false);

    /* Get overlap and course similarity. */
    const friendEnrollmentIds = new Set<number>();
    friendEnrollments.forEach((enrollment) =>
      friendEnrollmentIds.add(enrollment.courseId)
    );

    const overlap = context.enrollments.filter((enrollment) =>
      friendEnrollmentIds.has(enrollment.courseId)
    );

    setOverlap(overlap);

    let courseSimilarity = 0;
    if (context.enrollments.length)
      courseSimilarity = (100 * overlap.length) / context.enrollments.length;

    setCourseSimilarity(courseSimilarity);

    setRefreshing(false);
  };

  const checkInClass = () => {
    const now = Timestamp.now();
    const today = now.toDate().getDay() - 1;

    if (!weekRes.week[today]) {
      setInClass(false);
      return;
    }

    for (let event of weekRes.week[today].events) {
      if (!event.startInfo) continue;
      if (!event.endInfo) continue;
      if (
        timeIsEarlier(event.startInfo, now) &&
        timeIsEarlier(now, event.endInfo)
      ) {
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

    addNotification(user.id, "FRIEND_REQUEST_RECEIVED", context.user.id);
  };

  const handleAcceptRequest = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setFriendStatus("friends");
    acceptRequest(friendDocId);

    sendPushNotification(
      user.expoPushToken,
      `${context.user.name} accepted your friend request`
    );

    addNotification(user.id, "NEW_FRIENDSHIP", context.user.id);
  };

  const handleDeleteFriendship = async () => {
    setFriendStatus("not friends");
    setAddFriendDisabled(false);

    deleteFriendship(friendDocId);
    deleteFriendshipNotifications(context.user.id, user.id);

    setFriendDocId("");
  };

  const handleBlockUser = async () => {
    setFriendStatus("block sent");

    if (friendDocId) blockUserWithDoc(context.user.id, user.id, friendDocId);
    else blockUser(context.user.id, user.id);

    deleteFriendshipNotifications(context.user.id, user.id);
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
      if (action === "Block") blockAlert();
      else if (action === "Remove friend") removeFriendAlert();
      // else if (action === "Copy profile URL")
      //   console.log("Copy profile URL pressed");
    } else if (friendStatus === "block sent") {
      const action = blockedActionSheetOptions[index];
      if (action === "Unblock") unblockAlert();
      // else if (action === "Copy profile URL")
      //   console.log("Copy profile URL pressed");
    } else {
      const action = baseActionSheetOptions[index];
      if (action === "Block") blockAlert();
      // else if (action === "Copy profile URL")
      //   console.log("Copy profile URL pressed");
    }
  };

  const tabs = [
    {
      label: "Calendar",
      component: (
        <Calendar
          week={weekRes.week}
          startCalendarHour={weekRes.startCalendarHour}
          endCalendarHour={weekRes.endCalendarHour}
        />
      ),
    },
    {
      label: "Courses",
      component: (
        <EnrollmentList
          enrollments={currentEnrollments}
          checkMutual
          emptyElement={
            enrollmentsLoading ? (
              <ActivityIndicator />
            ) : (
              <EmptyList
                SVGElement={
                  quarterName === "Aut"
                    ? SVGAutumn
                    : quarterName === "Win"
                    ? SVGWinter
                    : quarterName === "Spr"
                    ? SVGSpring
                    : quarterName === "Sum"
                    ? SVGSummer
                    : SVGNoCourses
                }
                primaryText="No courses this quarter"
              />
            )
          }
        />
      ),
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
          <ProfilePhoto
            url={user.photoUrl}
            size={Layout.photo.large}
            style={{ marginRight: Layout.spacing.large }}
            withModal
          />
          <View style={{ width: "100%", flexShrink: 1 }}>
            <Text style={styles.name}>{user.name}</Text>
            <View
              style={[AppStyles.row, { marginVertical: Layout.spacing.xsmall }]}
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
                        text="Accept"
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
                <FontAwesome name="ellipsis-h" size={Layout.icon.medium} />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={[AppStyles.row, { marginTop: 15 }]}>
          <View style={{ flex: 1, marginRight: Layout.spacing.small }}>
            {/* Degrees */}
            {user.degrees ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <SimpleLineIcons name="pencil" size={Layout.icon.small} />
                </View>
                <View style={styles.aboutText}>
                  {user.degrees.map((d: Degree, i: number) => (
                    <Text style={styles.aboutText} key={i}>
                      {d.major}
                      {d.degree ? ` (${d.degree})` : ""}
                    </Text>
                  ))}
                </View>
              </View>
            ) : null}
            {/* Graduation Year */}
            {user.gradYear ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <SimpleLineIcons name="graduation" size={Layout.icon.small} />
                </View>
                <Text style={styles.aboutText}>{user.gradYear}</Text>
              </View>
            ) : null}
            {/* Interests */}
            {user.interests ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <SimpleLineIcons name="puzzle" size={Layout.icon.small} />
                </View>
                <Text style={styles.aboutText}>{user.interests}</Text>
              </View>
            ) : null}
          </View>
          <SquareButton
            num={friendIds.length.toString()}
            text={"friend" + (friendIds.length === 1 ? "" : "s")}
            size={Layout.buttonHeight.large}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("Friends", {
                id: route.params.id,
                friendIds,
              });
            }}
          />
        </View>
        {!user.isPrivate || friendStatus === "friends" ? (
          <>
            {!refreshing && (
              <ProgressBar
                progress={courseSimilarity}
                text={`${Math.round(courseSimilarity)}% course similarity`}
                onPress={() =>
                  navigation.navigate("CourseSimilarity", {
                    friendId: user.id,
                    courseSimilarity,
                    overlap,
                  })
                }
                containerStyle={{ marginTop: Layout.spacing.medium }}
              />
            )}
            <View style={[AppStyles.row, { marginTop: Layout.spacing.medium }]}>
              <Text style={styles.term}>
                {termIdToFullName(getCurrentTermId())}
              </Text>
              <Button
                text="View All Quarters"
                onPress={() =>
                  navigation.navigate("Quarters", {
                    user,
                    enrollments: enrollments,
                  })
                }
              />
            </View>
          </>
        ) : null}
      </View>
      <Separator />
      {user.isPrivate && !(friendStatus === "friends") ? (
        <EmptyList
          SVGElement={SVGPrivate}
          primaryText="This user is private"
          secondaryText="Add them as a friend to see their courses"
        />
      ) : (
        <View style={AppStyles.section}>
          <TabView
            tabs={tabs}
            selectedStyle={{ backgroundColor: Colors.pink }}
            initialSelectedId={1}
          />
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
