import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Course, Schedule } from "../../types";
import { termIdToYear } from "../../utils";

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
