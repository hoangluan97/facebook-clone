import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxVI_b42MSzeeTUfiuUGJBhZdPXzl3OsI",
  authDomain: "facebook-clone-2269d.firebaseapp.com",
  projectId: "facebook-clone-2269d",
  storageBucket: "facebook-clone-2269d.appspot.com",
  messagingSenderId: "624416724617",
  appId: "1:624416724617:web:1e4950016f2bb50c461858",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const storage = getStorage(app);

const db = getFirestore(app);

export { db, storage };
