// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrsa9w1kFNTkXBdxjxjP6xJ1gXdtoCmw8",
  authDomain: "h2oapp-4b000.firebaseapp.com",
  projectId: "h2oapp-4b000",
  storageBucket: "h2oapp-4b000.appspot.com",
  messagingSenderId: "1026216334119",
  appId: "1:1026216334119:web:88d2ef9e6fa58244ab4f02",
  measurementId: "G-QTVMWQ5Y92",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
