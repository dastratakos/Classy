import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { User } from "../types";
import { getCourseStudents } from "./courses";
import { getUser } from "./users";

export const getFriendIds = async (userId: string) => {
  const q = query(
    collection(db, "friends"),
    where(`ids.${userId}`, "==", true),
    where("status", "==", "friends")
  );
  const friendIds: string[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    for (let key in doc.data().ids) {
      if (key !== userId) {
        friendIds.push(key);
        return;
      }
    }
  });
  return friendIds;
};

export const getRequestIds = async (userId: string) => {
  const q = query(
    collection(db, "friends"),
    where(`ids.${userId}`, "==", true),
    where(`requesterId.${userId}`, "==", false),
    where("status", "==", "requested")
  );
  const friendIds = [] as string[];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    for (let key in doc.data().ids) {
      if (key !== userId) {
        friendIds.push(key);
        return;
      }
    }
  });
  return friendIds;
};

export const getFriendsFromIds = async (friendIds: string[]) => {
  let friendsList = [] as User[];
  let count = 0;

  await new Promise((resolve) => {
    friendIds.forEach((id) => {
      getUser(id).then((res) => {
        if (res) friendsList.push(res);
        count++;
        if (count === friendIds.length) resolve(null);
      });
    });
  });

  friendsList.sort((a, b) =>
    a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
  );
  return friendsList;
};

/**
 * Possible friend statuses:
 *   - not friends
 *   - request sent (you sent this friend a request)
 *   - request received (you received a request from this friend)
 *   - friends
 *   - blocked
 */
export const getFriendStatus = async (userId: string, friendId: string) => {
  const q = query(
    collection(db, "friends"),
    where(`ids.${friendId}`, "==", true),
    where(`ids.${userId}`, "==", true)
  );

  let friendStatus = "not friends"; // default status
  let friendDocId = "";

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((res) => {
    /* Delete any extra friendship documents. */
    // if (friendStatus !== "not friends") {
    //   deleteDoc(doc(db, "friends", res.id));
    //   return;
    // }

    console.log("friendship:", res.data());
    friendDocId = res.id;

    if (res.data().status === "requested") {
      if (res.data().requesterId[userId]) friendStatus = "request sent";
      else friendStatus = "request received";
    } else if (res.data().status === "blocked") {
      if (res.data().requesterId[userId]) friendStatus = "block sent";
      else friendStatus = "block received";
    } else {
      friendStatus = res.data().status;
    }
  });

  return { friendDocId, friendStatus };
};

export const addFriend = async (userId: string, friendId: string) => {
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

  return docRef.id;
};

export const acceptRequest = async (friendDocId: string) => {
  const docRef = doc(db, "friends", friendDocId);
  await updateDoc(docRef, { status: "friends" });
};

export const deleteFriendship = async (friendDocId: string) => {
  const docRef = doc(db, "friends", friendDocId);
  await deleteDoc(docRef);
};

export const blockUser = async (userId: string, friendId: string) => {
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
  console.log("User blocked with doc ID:", docRef.id);
};

export const blockUserWithDoc = async (
  userId: string,
  friendId: string,
  friendDocId: string
) => {
  const docRef = doc(db, "friends", friendDocId);

  await updateDoc(docRef, {
    requesterId: {
      [userId]: true,
      [friendId]: false,
    },
    status: "blocked",
  });
};

export const getFriendsInCourse = async (userId: string, courseId: number) => {
  const friends = [];

  const allStudents = await getCourseStudents(courseId);
  const friendIds = await getFriendIds(userId);

  console.log("allStudents:", allStudents);
  console.log("friendIds:", friendIds);

  return [];
};
