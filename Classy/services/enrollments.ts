import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Course, Enrollment, Schedule } from "../types";
import { termIdToYear } from "../utils";

export const getEnrollmentsForTerm = async (userId: string, termId: string) => {
  const q = query(
    collection(db, "enrollments"),
    where("userId", "==", userId),
    where("termId", "==", termId)
  );

  const res: Enrollment[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res.push({ ...doc.data(), docId: doc.id } as Enrollment);
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

export const deleteEnrollment = async (docId: string) => {
  await deleteDoc(doc(db, "enrollments", docId));
};
