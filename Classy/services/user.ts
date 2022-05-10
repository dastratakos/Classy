import { auth, db, storage } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { User } from "../../types";

export const updateUser = async (id: string, data: User) => {
  const userRef = doc(db, "users", id);
  await updateDoc(userRef, data);
};
