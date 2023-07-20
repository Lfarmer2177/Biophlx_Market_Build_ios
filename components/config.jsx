// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase} from "firebase/database"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnA6KE5Nsyk2bllJI4OQxagCGSfyKawl8",
  authDomain: "biophlxapp.firebaseapp.com",
  databaseURL: "https://biophlxapp-default-rtdb.firebaseio.com",
  projectId: "biophlxapp",
  storageBucket: "biophlxapp.appspot.com",
  messagingSenderId: "664603995338",
  appId: "1:664603995338:web:cf1659a35fa4cf3a8bd833",
  measurementId: "G-QLLF27XDXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//Initialize Database 
export const db = getDatabase(app);