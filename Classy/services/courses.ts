import { Course, Schedule } from "../types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

import { FavoritedCourse } from "../types";
import { db } from "../firebase";
import { termIdToYear } from "../utils";

export const searchCourses = async (search: string) => {
  if (search === "") return [];

  const q = query(
    collection(db, "courses"),
    where("keywords", "array-contains", search.toLowerCase().trim()),
    orderBy("code"),
    limit(3)
  );

  const res: Course[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res.push(doc.data() as Course);
  });
  return res;
};

export const searchMoreCourses = async (
  search: string,
  lastCourse: Course
) => {
  if (search === "") return [];

  const q = query(
    collection(db, "courses"),
    where("keywords", "array-contains", search.toLowerCase().trim()),
    orderBy("code"),
    startAfter(lastCourse),
    limit(3)
  );

  const res: Course[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res.push(doc.data() as Course);
  });
  return res;
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

export const addEnrollment = async (
  course: Course,
  grading: string,
  schedules: Schedule[],
  termId: string,
  units: number,
  userId: string
) => {
  /* 1. Create doc in enrollments collection. */
  const data = {
    code: course.code,
    courseId: course.courseId,
    grading,
    schedules,
    termId,
    title: course.title,
    units,
    userId,
  };

  await addDoc(collection(db, "enrollments"), data);

  /* 2. Update number of units in user doc in users collection. */
  // TODO: need to check if that field exists in the user terms?
  const year = termIdToYear(termId);
  const termKey = `terms.${year}.${termId}`;
  let userData = {};
  userData[termKey] = increment(units);

  await updateDoc(doc(db, "users", userId), userData);

  /* 3. Updates students list for that term in courses collection. */
  const studentsKey = `students.${userId}`;
  let courseData = {};
  courseData[studentsKey] = true;
  await updateDoc(
    doc(doc(db, "courses", `${course.courseId}`), "terms", termId),
    courseData
  );
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
  const q = query(collection(db, "favorites"), where("userId", "==", userId));

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
