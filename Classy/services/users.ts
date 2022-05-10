import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

import { User } from "../types";
import { db } from "../firebase";

export const updateUser = async (userId: string, data: User) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

export const searchUsers = async (userId: string, search: string) => {
  if (search === "") return [];

  const q = query(
    collection(db, "users"),
    where("keywords", "array-contains", search.toLowerCase()),
    orderBy("name"),
    limit(3)
  );

  const res: User[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.id !== userId) res.push(doc.data() as User);
  });
  return res;
};

export const searchMoreUsers = async (
  userId: string,
  search: string,
  lastUser: User
) => {
  if (search === "") return [];

  const q = query(
    collection(db, "users"),
    where("keywords", "array-contains", search.toLowerCase()),
    orderBy("name"),
    startAfter(lastUser),
    limit(3)
  );

  const res: User[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.id !== userId) res.push(doc.data() as User);
  });
  return res;
};
