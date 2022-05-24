import { Course, Schedule } from "../types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";

import { FavoritedCourse } from "../types";
import { db } from "../firebase";

export const getCourse = async (courseId: number) => {
  const q = query(collection(db, "courses"), where("courseId", "==", courseId));

  let res = {} as Course;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res = doc.data() as Course;
  });
  return res;
};

export const searchCourses = async (search: string, maxLimit: number = 3) => {
  if (search === "") return [];

  const q = query(
    collection(db, "courses"),
    where("keywords", "array-contains", search.toLowerCase().trim()),
    orderBy("code"),
    limit(maxLimit)
  );

  const courses: Course[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    courses.push(doc.data() as Course);
  });

  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  return { courses, lastVisible };
};

export const searchMoreCourses = async (
  search: string,
  lastCourse: Course,
  maxLimit: number = 10
) => {
  if (search === "") return [];

  const q = query(
    collection(db, "courses"),
    where("keywords", "array-contains", search.toLowerCase().trim()),
    orderBy("code"),
    startAfter(lastCourse),
    limit(maxLimit)
  );

  const courses: Course[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    courses.push(doc.data() as Course);
  });
  console.log("In searchMoreCourses, courses.length =", courses.length);

  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  return { courses, lastVisible };
};

export const getCourseTerms = async (courseId: number) => {
  const q = query(collection(doc(db, "courses", `${courseId}`), "terms"));

  const res = {};
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let resSchedules = doc.data().schedules;
    resSchedules.sort(
      (a: Schedule, b: Schedule) => a.sectionNumber > b.sectionNumber
    );
    let resStudents = doc.data().students;

    res[`${doc.id}`] = resSchedules;
  });
  return res;
};

export const getCourseStudents = async (courseId: number) => {
  const q = query(collection(doc(db, "courses", `${courseId}`), "terms"));

  const res = {};
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let resStudents = doc.data().students;

    res[`${doc.id}`] = resStudents;
  });
  return res;
};

export const getIsFavorited = async (userId: string, courseId: number) => {
  const q = query(
    collection(db, "favorites"),
    where("courseId", "==", courseId),
    where("userId", "==", userId)
  );

  let res = false;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res = true;
  });
  return res;
};

export const getFavorites = async (userId: string) => {
  const q = query(
    collection(db, "favorites"),
    where("userId", "==", userId),
    orderBy("code")
  );

  const res: FavoritedCourse[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res.push(doc.data() as FavoritedCourse);
  });
  return res;
};

export const addFavorite = async (userId: string, course: Course) => {
  const data = {
    code: course.code,
    courseId: course.courseId,
    title: course.title,
    userId,
  };

  await addDoc(collection(db, "favorites"), data);
};

export const deleteFavorite = async (userId: string, courseId: number) => {
  const q = query(
    collection(db, "favorites"),
    where("courseId", "==", courseId),
    where("userId", "==", userId)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((res) => {
    deleteDoc(doc(db, "favorites", res.id));
  });
};
