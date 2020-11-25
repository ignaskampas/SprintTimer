import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBkIfM1pFKwtelI1p-yydOcDgqAgtArxmY",
    authDomain: "dash-3fbe1.firebaseapp.com",
    databaseURL: "https://dash-3fbe1.firebaseio.com",
    projectId: "dash-3fbe1",
    storageBucket: "dash-3fbe1.appspot.com",
    messagingSenderId: "251802746080",
    appId: "1:251802746080:web:5690f478e5c3c672282485",
    measurementId: "G-ZFR0P9EQ3P"
};


firebase.initializeApp(firebaseConfig);

const firebaseDb = firebase.database();
const storageRef = firebase.storage().ref();
const firebaseAuth = firebase.auth();

export {firebase, firebaseDb, storageRef, firebaseAuth};
