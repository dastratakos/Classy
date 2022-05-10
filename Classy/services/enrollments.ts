import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Enrollment } from "../types";

export const getEnrollmentsForTerm = async (userId: string, termId: string) => {
  const q = query(
    collection(db, "enrollments"),
    where("userId", "==", userId),
    where("termId", "==", termId)
  );

  const res: Enrollment[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res.push(doc.data() as Enrollment);
  });
  return res;
};
