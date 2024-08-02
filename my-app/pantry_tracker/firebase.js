// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCVL1ayQBNfAfFkYp60E9BQbWuiWF4MYQQ",
    authDomain: "pantry-tracker-dd7e9.firebaseapp.com",
    projectId: "pantry-tracker-dd7e9",
    storageBucket: "pantry-tracker-dd7e9.appspot.com",
    messagingSenderId: "518573800429",
    appId: "1:518573800429:web:0c5561d4512c7676e545e4",
    measurementId: "G-FSZ599X8XP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export default firestore;
