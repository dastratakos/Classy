import { Notification } from "../types";
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
  type: string,
  friendId?: string,
  courseId?: number,
  termId?: string
) => {
  const data = {
    userId,
    type,
    timestamp: Timestamp.now(),
    friendId,
    courseId,
    termId,
    unread: true,
  };

  await addDoc(collection(db, "notifications"), data);
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
