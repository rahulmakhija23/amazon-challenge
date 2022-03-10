import firebase from "firebase";
import "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARRxohg6ZO7NJoiqzadRMbBOBmxZaqlws",
  authDomain: "challenge-224c5.firebaseapp.com",
  projectId: "challenge-224c5",
  storageBucket: "challenge-224c5.appspot.com",
  messagingSenderId: "1035053895591",
  appId: "1:1035053895591:web:5791537c62f498e165f082",
  measurementId: "G-5SVBYEMDNZ",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
