import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

async function loadFirebaseConfig() {
    try {
        const response = await fetch('/config.json');
        const firebaseConfig = await response.json();
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        console.log("Firebase initialized successfully!");
        return db;
    } catch (error) {
        console.error("Error loading Firebase config:", error);
        alert("Failed to load Firebase settings.");
        return null;
    }
}

const dbPromise = loadFirebaseConfig();

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username-input").value.trim();

    if (!username) {
        alert("الرجاء إدخال اسم المستخدم.");
        return;
    }

    try {
        const db = await dbPromise;
        if (!db) return;

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