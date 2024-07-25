// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6Ciq9aXr0Z3EJczBXlOpNzeiAyoLfBN0",
  authDomain: "doc-pal-7adc6.firebaseapp.com",
  projectId: "doc-pal-7adc6",
  storageBucket: "doc-pal-7adc6.appspot.com",
  messagingSenderId: "163311459446",
  appId: "1:163311459446:web:89f3e2ec35e59c94e45357",
  measurementId: "G-PV35HPNVFY",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

const storage = getStorage(app);

export { db, storage };
