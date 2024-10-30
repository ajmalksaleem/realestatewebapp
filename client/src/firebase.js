// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "real-estate-web-app-d6cf1.firebaseapp.com",
    projectId: "real-estate-web-app-d6cf1",
    storageBucket: "real-estate-web-app-d6cf1.appspot.com",
    messagingSenderId: "815146266695",
    appId: "1:815146266695:web:f977e3b0cf19ae9eff0162"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);