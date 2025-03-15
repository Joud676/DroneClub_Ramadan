import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdDcXqRLypztFUskDHx3DD-eXqRSeM9j8",
  authDomain: "ramadan-7647a.firebaseapp.com",
  projectId: "ramadan-7647a",
  storageBucket: "ramadan-7647a.firebasestorage.app",
  messagingSenderId: "572887923466",
  appId: "1:572887923466:web:d5b3555a20ebf6b79658f3",
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
