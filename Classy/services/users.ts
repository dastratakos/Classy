import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { User } from "../types";
import { db } from "../firebase";

export const getUser = async (id: string) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    console.log(`Could not find user: ${id}`);
    alert("This user does not exist.");
    return {} as User;
  }
};

export const setUser = async (id: string, email: string) => {
  const data = {
    id,
    email,
    createdAt: Timestamp.now(),
    isPrivate: false,
  };

  await setDoc(doc(db, "users", id), data);

  return data;
};

export const updateUser = async (userId: string, data: Partial<User>) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

export const deleteUserCompletely = async (userId: string) => {
  /* Get all Enrollments and delete. */
  const batch1 = writeBatch(db);
  const q1 = query(
    collection(db, "enrollments"),
    where("userId", "==", userId)
  );
  getDocs(q1).then((querySnapshot1) => {
    querySnapshot1.forEach((doc) => {
      batch1.delete(doc.ref);
    });
    batch1.commit();

    /* Get all Friends (relationships) and delete. */
    const batch2 = writeBatch(db);
    const q2 = query(
      collection(db, "friends"),
      where(`ids.${userId}`, "==", true)
    );
    getDocs(q2).then((querySnapshot2) => {
      querySnapshot2.forEach((doc) => {
        batch2.delete(doc.ref);
      });
      batch2.commit();

      /* Get the user document and delete it. */
      deleteDoc(doc(db, "users", userId));
    });
  });
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
