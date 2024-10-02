// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCz_KoXd3WP5QIRj3sK7ctg3z0-ZbLPrWo",
  authDomain: "tvon-escalante.firebaseapp.com",
  projectId: "tvon-escalante",
  storageBucket: "tvon-escalante.appspot.com",
  messagingSenderId: "233458040213",
  appId: "1:233458040213:web:b7b5b2cc4a71e030904a9c",
  measurementId: "G-SSVE9QJHRY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage=getStorage(app)
export const db= getFirestore(app)
export const auth= getAuth(app)