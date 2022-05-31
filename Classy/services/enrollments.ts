import { Course, Enrollment, Schedule, User } from "../types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import { termIdToYear } from "../utils";
import { getFriendIds, getNumFriendsInCourse } from "./friends";

export const getEnrollmentsForTerm = async (
  myId: string,
  userId: string,
  termId: string
) => {
  const q = query(
    collection(db, "enrollments"),
    where("userId", "==", userId),
    where("termId", "==", termId),
    orderBy("code")
  );

  const res: Enrollment[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res.push({ ...doc.data(), docId: doc.id } as Enrollment);
  });

  /* Collect number of friends per enrollment. */
  const friendIds = await getFriendIds(myId);
  for (let i = 0; i < res.length; i++) {
    res[i].numFriends = await getNumFriendsInCourse(
      res[i].courseId,
      friendIds,
      termId
    );
  }

  return res;
};

export const getEnrollments = async (userId: string) => {
  const q = query(
    collection(db, "enrollments"),
    where("userId", "==", userId),
    orderBy("code")
  );

  const res: Enrollment[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res.push({ ...doc.data(), docId: doc.id } as Enrollment);
  });
  return res;
};

export const getOverlap = async (userId: string, friendId: string) => {
  const userEnrollments = await getEnrollments(userId);
  const friendEnrollments = await getEnrollments(friendId);

  const friendEnrollmentIds = new Set<number>();
  friendEnrollments.forEach((enrollment) =>
    friendEnrollmentIds.add(enrollment.courseId)
  );

  const overlap = userEnrollments.filter((enrollment) =>
    friendEnrollmentIds.has(enrollment.courseId)
  );

  let courseSimilarity = 0;
  if (userEnrollments.length)
    courseSimilarity = (100 * overlap.length) / userEnrollments.length;

  return { courseSimilarity, overlap };
};

export const addEnrollment = async (
  course: Course,
  grading: string,
  schedules: Schedule[],
  termId: string,
  units: number,
  user: User
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
    userId: user.id,
  };

  await addDoc(collection(db, "enrollments"), data);

  /* 2. Update number of units in user doc in users collection. */
  const yearKey = termIdToYear(termId);
  console.log("yearKey:", yearKey);

  let newTerms = user.terms;

  if (yearKey in newTerms) {
    if (termId in newTerms[yearKey]) newTerms[yearKey][termId] += units;
    else newTerms[yearKey][termId] = units;
  } else {
    newTerms[yearKey] = {};
    for (let quarter of ["2", "4", "6", "8"]) {
      const termIdKey = termId.substring(0, 3) + quarter;
      newTerms[yearKey][termIdKey] = termIdKey === termId ? units : 0;
    }
  }

  await updateDoc(doc(db, "users", user.id), { terms: newTerms });

  /* 3. Update students list for that term in courses collection. */
  const studentsKey = `students.${user.id}`;
  let courseData = {};
  courseData[studentsKey] = true;
  await updateDoc(
    doc(doc(db, "courses", `${course.courseId}`), "terms", termId),
    courseData
  );
};

export const updateEnrollment = async (
  oldEnrollment: Enrollment,
  color: string,
  grading: string,
  schedules: Schedule[],
  termId: string,
  units: number,
  userId: string
) => {
  /* 1. Update doc in enrollments collection. */
  const data = {
    color,
    grading,
    schedules,
    termId,
    units,
    userId,
  };

  await updateDoc(doc(db, "enrollments", oldEnrollment.docId), data);

  /* 2. Update number of units in user doc in users collection. */
  const oldYear = termIdToYear(oldEnrollment.termId);
  const oldTermKey = `terms.${oldYear}.${oldEnrollment.termId}`;

  const year = termIdToYear(termId);
  const termKey = `terms.${year}.${termId}`;

  let userData = {};
  userData[oldTermKey] = increment(-oldEnrollment.units);
  userData[termKey] = increment(units);

  await updateDoc(doc(db, "users", userId), userData);

  /* 3. Updates students list for that term in courses collection. */
  if (oldEnrollment.termId !== termId) {
    /* Set key to true in new term. */
    const studentsKey = `students.${userId}`;
    let courseData = {};
    courseData[studentsKey] = true;
    await updateDoc(
      doc(doc(db, "courses", `${oldEnrollment.courseId}`), "terms", termId),
      courseData
    );

    /* Set key to false in old term. */
    let oldCourseData = {};
    oldCourseData[studentsKey] = false;
    await updateDoc(
      doc(
        doc(db, "courses", `${oldEnrollment.courseId}`),
        "terms",
        oldEnrollment.termId
      ),
      oldCourseData
    );
  }
};

export const deleteEnrollment = async (enrollment: Enrollment) => {
  /* 1. Delete enrollment doc. */
  await deleteDoc(doc(db, "enrollments", enrollment.docId));

  /* 2. Update number of units in user doc in users collection. */
  const year = termIdToYear(enrollment.termId);
  const termKey = `terms.${year}.${enrollment.termId}`;

  let userData = {};
  userData[termKey] = increment(-enrollment.units);

  await updateDoc(doc(db, "users", enrollment.userId), userData);

  /* 3. Set key to false in term. */
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
};
