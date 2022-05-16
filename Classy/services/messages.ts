import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const getChannelId = async (members, userId?: string) => {
  const memberConstraints = [];
  if (userId) memberConstraints.push(where(`members.${userId}`, "==", true));
  Object.keys(members).forEach((id) => {
    memberConstraints.push(where(`members.${id}`, "==", true));
  });

  let length = Object.keys(members).length;
  if (userId) length++;

  const q = query(
    collection(db, "channels"),
    ...memberConstraints,
    where("memberCount", "==", length)
  );

  let channelId = "";

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    channelId = doc.id;
    console.log(`Found existing channel doc: ${doc.id}`);
  });

  return channelId;
};

/**
 * For a group chat with 3 or more people, we will create a Firestore object
 * in the "channels" collection to represent it. The channelId will be the
 * id of the corresponding Firestore doc.
 */
export const getNewGroupChatId = async (members) => {
  const data = {
    members,
    memberCount: Object.keys(members).length,
  };

  const doc = await addDoc(collection(db, "channels"), data);
  console.log(`Created new channel doc: ${doc.id}`);

  return doc.id;
};
