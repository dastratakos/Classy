import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

// import { getAnalytics } from "firebase/analytics";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "cs194w-team4.firebaseapp.com",
  databaseURL: "https://cs194w-team4-default-rtdb.firebaseio.com",
  projectId: "cs194w-team4",
  storageBucket: "cs194w-team4.appspot.com",
  messagingSenderId: "92368913575",
  appId: "1:92368913575:web:14f5fa153d8a4672140782",
  measurementId: "G-XHBYVTKB5S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(app);
const functions = getFunctions(app);

/* IMPORTANT: The following should only be used for local development. */
// connectFirestoreEmulator(db, "localhost", 8080);
// connectFunctionsEmulator(functions, "localhost", 5001);

export {
  // analytics,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  db,
  storage,
};
