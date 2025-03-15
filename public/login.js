import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "FIREBASE_AUTH_DOMAIN",
  projectId: "FIREBASE_PROJECT_ID",
  storageBucket: "FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID",
  appId: "FIREBASE_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username-input").value.trim();

    if (!username) {
        alert("الرجاء إدخال اسم المستخدم.");
        return;
    }

    try {
        const usersRef = collection(db, "Users");
        const querySnapshot = await getDocs(query(usersRef, where("username", "==", username)));

        if (!querySnapshot.empty) {
            localStorage.setItem("username", username);
            window.location.href = "play.html";
        } else {
            alert("اسم المستخدم غير موجود. الرجاء إنشاء حساب جديد.");
        }
    } catch (error) {
        console.error("Error checking user:", error);
        alert("حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.");
    }
});
