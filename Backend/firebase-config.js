// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-ASCBaK66Xt3_96fX5WPujtWg8ppOBSk",
  authDomain: "course-9c5ef.firebaseapp.com",
  projectId: "course-9c5ef",
  storageBucket: "course-9c5ef.appspot.com",
  messagingSenderId: "701052805244",
  appId: "1:701052805244:web:14d101a906b4bc23bbe9f9",
  measurementId: "G-EY0TJ16Q74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
