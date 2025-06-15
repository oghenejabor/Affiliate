import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAfFcP1p2hsfqpJ_i4pULqgnFzLLxWW7UA",
  authDomain: "project-9204543037598647331.firebaseapp.com",
  databaseURL: "https://project-9204543037598647331-default-rtdb.firebaseio.com",
  projectId: "project-9204543037598647331",
  storageBucket: "project-9204543037598647331.firebasestorage.app",
  messagingSenderId: "922903200544",
  appId: "1:922903200544:web:cae7edb79de4213b7f4d45",
  measurementId: "G-8CHG17YGE9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export default app;