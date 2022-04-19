// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const analytics = getAnalytics(app);
const auth = getAuth();

export {
  analytics,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
