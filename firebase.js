import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqXm_T_VdOI83AU1j3mMqkg8VtMEN_K0s",
  authDomain: "resq-ai-a754a.firebaseapp.com",
  projectId: "resq-ai-a754a",
  storageBucket: "resq-ai-a754a.firebasestorage.app",
  messagingSenderId: "648050770905",
  appId: "1:648050770905:web:9bd13112c5b85e4c344fc8",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };