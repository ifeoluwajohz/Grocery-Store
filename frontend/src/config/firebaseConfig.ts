// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBx5aRanviQqWB1lqcUBq2RJ2AVwnnwrEk",
  authDomain: "openai-app-a9e88.firebaseapp.com",
  projectId: "openai-app-a9e88",
  storageBucket: "openai-app-a9e88.firebasestorage.app",
  messagingSenderId: "967525320705",
  appId: "1:967525320705:web:eaf0cfac1a98938d8d1800",
  measurementId: "G-ZZJV2W6DWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

export { auth };