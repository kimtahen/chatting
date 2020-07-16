import firebase from "firebase";
let firebaseConfig = {
    apiKey: "AIzaSyAoK6UHQexHKfS9TP7-SXMABgbGc9HzKSM",
    authDomain: "navydoc-9fe01.firebaseapp.com",
    databaseURL: "https://navydoc-9fe01.firebaseio.com",
    projectId: "navydoc-9fe01",
    storageBucket: "navydoc-9fe01.appspot.com",
    messagingSenderId: "1075453298278",
    appId: "1:1075453298278:web:d320905c35e5441fc98fa7"
};

const Firebase = firebase.initializeApp(firebaseConfig);
export default Firebase.firestore();