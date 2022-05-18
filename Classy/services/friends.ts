import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { User } from "../types";
import { getCourseStudents } from "./courses";
import { getPublicUserIds, getUser } from "./users";

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
  if (friendIds.length === 0) return [];

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

  friendsList.sort((a, b) => {
    if (!a.name) return 1;
    if (!b.name) return -1;
    return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
  });
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

export const getAllPeopleIdsInCourse = async (
  userId: string,
  courseId: number
) => {
  const allStudents = await getCourseStudents(courseId);
  const friendIds = await getFriendIds(userId);
  const publicIds = await getPublicUserIds(userId);

  const res = {};
  Object.keys(allStudents).forEach((term) => {
    if (!allStudents[`${term}`]) return;

    let friends: string[] = [];
    let publicUsers: string[] = [];
    Object.entries(allStudents[`${term}`]).filter(([studentId, enrolled]) => {
      if (enrolled && friendIds.includes(studentId)) friends.push(studentId);
      else if (
        enrolled &&
        publicIds.includes(studentId) &&
        studentId !== userId
      )
        publicUsers.push(studentId);
    });
    res[`${term}`] = { friendIds: friends, publicIds: publicUsers };
  });

  return res;
};

export const getFriendsInCourse = async (
  userId: string,
  courseId: number,
  termId: string
) => {
  const friendIds = await getFriendIds(userId);

  const docRef = doc(doc(db, "courses", `${courseId}`), "terms", termId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const students = docSnap.data().students;

    if (!students) return [];

    const filtered = Object.fromEntries(
      Object.entries(students).filter(
        ([studentId, enrolled]) => enrolled && friendIds.includes(studentId)
      )
    );

    let friends: User[] = [];
    for (let friendId of Object.keys(filtered)) {
      friends.push(await getUser(friendId));
    }
    return friends;
  } else {
    console.log(`No termId ${currentTermId} for course ${courseId}`);
    return [] as User[];
  }
};

export const getNumFriendsInCourse = async (
  courseId: number,
  friendIds: string[],
  termId: string
) => {
  const docRef = doc(doc(db, "courses", `${courseId}`), "terms", termId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    if (!docSnap.data().students) {
      console.log(
        `No students doc for termId ${termId} for course ${courseId}`
      );
      return 0;
    }

    const students = docSnap.data().students;
    const filtered = Object.entries(students).filter(
      ([studentId, enrolled]) => enrolled && friendIds.includes(studentId)
    );
    return filtered.length;
  } else {
    console.log(`No termId ${termId} for course ${courseId}`);
    return 0;
  }
};
