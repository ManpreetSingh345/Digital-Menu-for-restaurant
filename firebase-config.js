import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJUq0hUAXRm5scDqxqhqiW5WC_boAx8oQ",
  authDomain: "digitalmenu-2c73d.firebaseapp.com",
  projectId: "digitalmenu-2c73d",
  storageBucket: "digitalmenu-2c73d.firebasestorage.app",
  messagingSenderId: "75018010800",
  appId: "1:75018010800:web:c65da2165bbd9d65ba3b75"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // We export 'db' to use it in script.js