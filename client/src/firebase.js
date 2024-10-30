import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyConL7Rx9e60CgnCS9ASEEoFx6rZNvAhGw",
  authDomain: "thesis-final-final.firebaseapp.com",
  databaseURL: "https://thesis-final-final-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "thesis-final-final",
  storageBucket: "thesis-final-final.appspot.com",
  messagingSenderId: "929261164713",
  appId: "1:929261164713:web:66ecdc8422c6102f1031b8"
};


export const app = initializeApp(firebaseConfig);
