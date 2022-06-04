import {
  Timestamp,
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
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { User } from "../types";
import { db } from "../firebase";
import { getEnrollments } from "./enrollments";

export const getUser = async (id: string) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    console.log(`Could not find user: ${id}`);
    return {} as User;
  }
};

// TODO: this function needs to be optimized. Too many reads.
export const getPublicUserIds = async (userId: string) => {
  const q = query(collection(db, "users"), where("isPrivate", "==", false));
  const publicUserIds: string[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => publicUserIds.push(doc.data().id));

  return publicUserIds;
};

export type NewUser = {
  id: string;
  email: string;
  interests: string;
  createdAt: Timestamp;
  isPrivate: boolean;
};

export const setUser = async (data: NewUser) => {
  await setDoc(doc(db, "users", data.id), data);

  return data;
};

export const updateUser = async (userId: string, data: Partial<User>) => {
  const userRef = doc(db, "users", userId);
  console.log("updating user with data:", data);
  await updateDoc(userRef, data);
};

export const deleteUserCompletely = async (userId: string) => {
  /* 1. Get all Enrollments and delete. */
  const enrollments = await getEnrollments(userId);
  for (let enrollment of enrollments) {
    /* 1a. Delete enrollment doc. */
    await deleteDoc(doc(db, "enrollments", enrollment.docId));

    /* 1b. Set key to false in term. */
    const studentsKey = `students.${enrollment.userId}`;
    let courseData = {};
    courseData[studentsKey] = false;
    await updateDoc(
      doc(
        doc(db, "courses", `${enrollment.courseId}`),
        "terms",
        enrollment.termId
      ),
      courseData
    );
  }

  /* 2. Get all Friends (relationships) and delete. */
  const batch2 = writeBatch(db);
  const q2 = query(
    collection(db, "friends"),
    where(`ids.${userId}`, "==", true)
  );
  await getDocs(q2).then((querySnapshot2) => {
    querySnapshot2.forEach((doc) => {
      batch2.delete(doc.ref);
    });
    batch2.commit();
  });

  // TODO: Remove from chats

  /* 3. Get all Favorites and delete. */
  const batch3 = writeBatch(db);
  const q3 = query(collection(db, "favorites"), where("userId", "==", userId));
  await getDocs(q3).then((querySnapshot3) => {
    querySnapshot3.forEach((doc) => {
      batch3.delete(doc.ref);
    });
    batch3.commit();
  });

  /* 4. Delete search history. */
  deleteDoc(doc(db, "history", userId));

  /* 3. Get the user document and delete it. */
  deleteDoc(doc(db, "users", userId));
};

export const searchUsers = async (
  userId: string,
  search: string,
  maxLimit: number = 3
) => {
  if (search === "") return [];

  const q = query(
    collection(db, "users"),
    where("keywords", "array-contains", search.toLowerCase()),
    orderBy("name"),
    limit(maxLimit)
  );

  const users: User[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.id !== userId) users.push(doc.data() as User);
  });

  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  return { users, lastVisible };
};

export const searchMoreUsers = async (
  userId: string,
  search: string,
  lastUser: User,
  maxLimit: number = 10
) => {
  if (search === "") return [];

  const q = query(
    collection(db, "users"),
    where("keywords", "array-contains", search.toLowerCase()),
    orderBy("name"),
    startAfter(lastUser),
    limit(maxLimit)
  );

  const users: User[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.id !== userId) users.push(doc.data() as User);
  });

  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  return { users, lastVisible };
};

export const generateTerms = (
  terms: Object,
  startYear: string,
  endYear: string
) => {
  let res = terms;
  if (!res) res = {};

  /* Remove empty years. */
  for (const yearKey of Object.keys(res)) {
    let empty = true;
    for (const termId of Object.keys(res[yearKey])) {
      if (res[yearKey][termId] > 0) {
        empty = false;
        break;
      }
    }

    if (empty) {
      delete res[yearKey];
    }
  }

  /* Add and fill in the years in the range of startYear to gradYear. */
  for (let year = parseInt(startYear); year < parseInt(endYear); year++) {
    const yearKey = `${year}-${(year % 100) + 1}`;

    if (!res[yearKey]) res[yearKey] = {};

    for (let quarter of [2, 4, 6, 8]) {
      const termId = `${(year + 1 - 1900) * 10 + quarter}`;
      if (res[yearKey][termId]) continue;
      res[yearKey][termId] = 0;
    }
  }
  console.log("terms =", res);
  return res;
};
