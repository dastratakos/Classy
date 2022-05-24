import { Course, History, Schedule, User } from "../types";
import {
  addDoc,
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
  where,
} from "firebase/firestore";

import { HistoryIds } from "../types";
import { db } from "../firebase";
import { getUser } from "./users";
import { getCourse } from "./courses";

export const getHistory = async (id: string) => {
  const docRef = doc(db, "history", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let history = docSnap.data() as HistoryIds;

    let people: User[] = [];
    for (let id of history.people) people.push(await getUser(id));

    let courses: Course[] = [];
    for (let id of history.courses) courses.push(await getCourse(id));

    return { people, courses } as History;
  } else {
    console.log(`Could not find history for user: ${id}`);
    return {} as History;
  }
};

export const setHistory = async (id: string, data: History) => {
  let peopleIds = [];
  for (let user of data.people) peopleIds.push(user.id);

  let courseIds = [];
  for (let course of data.courses) courseIds.push(course.courseId);

  let historyIds: HistoryIds = { people: peopleIds, courses: courseIds };

  await setDoc(doc(db, "history", id), historyIds);

  return data;
};
