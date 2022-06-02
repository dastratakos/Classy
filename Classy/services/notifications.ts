import { Notification, NotificationType } from "../types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

export const getNotifications = async (userId: string) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );

  const res: Notification[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res.push({ ...doc.data(), docId: doc.id } as Notification);
  });

  return res;
};

export const addNotification = async (
  userId: string,
  type: NotificationType,
  friendId?: string,
  courseId?: number,
  termId?: string
) => {
  const data: Partial<Notification> = {
    userId,
    type,
    timestamp: Timestamp.now(),
    unread: true,
  };
  if (friendId) data.friendId = friendId;
  if (courseId) data.courseId = courseId;
  if (termId) data.termId = termId;

  await addDoc(collection(db, "notifications"), data);

  /**
   * If the user just accepted a friend request, we need to delete the original
   * FRIEND_REQUEST_RECEIVED notification.
   */
  if (type === "FRIEND_REQUEST_ACCEPTED") {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", friendId),
      where("type", "==", "FRIEND_REQUEST_RECEIVED"),
      where("friendId", "==", userId)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((res) => {
      deleteDoc(doc(db, "notifications", res.id));
    });
  }
};

export const updateNotification = async (
  docId: string,
  data: Partial<Notification>
) => {
  const notificationRef = doc(db, "notifications", docId);
  console.log("updating notification with data:", data);
  await updateDoc(notificationRef, data);
};

export const deleteNotification = async (docId: string) => {
  await deleteDoc(doc(db, "notifications", docId));
};
