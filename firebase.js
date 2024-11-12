// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyCjaL-aOgoWH1-WZJgv4ymoRiOHNCHvQB4",
  authDomain: "chatapp-f7bfc.firebaseapp.com",
  projectId: "chatapp-f7bfc",
  storageBucket: "chatapp-f7bfc.appspot.com",
  messagingSenderId: "708050674488",
  appId: "1:708050674488:web:23357dfd393bfaf3edd7cd"
};

const app = initializeApp(firebaseConfig);

// Initialiser Firestore
 const db = getFirestore(app);
export { db };

