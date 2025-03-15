import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username-input").value.trim();
    const email = document.getElementById("email-input").value.trim();

    if (!username || !email) {
        alert("الرجاء ملء جميع الحقول.");
        return;
    }

    try {
        const db = await dbPromise;
        if (!db) return;

        const userRef = doc(db, "Users", username);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            alert("اسم المستخدم موجود بالفعل. الرجاء اختيار اسم مستخدم آخر.");
            return;
        }

        const usersRef = collection(db, "Users");
        const emailQuery = query(usersRef, where("email", "==", email));
        const emailQuerySnapshot = await getDocs(emailQuery);

        if (!emailQuerySnapshot.empty) {
            alert("البريد الإلكتروني موجود بالفعل. الرجاء استخدام بريد إلكتروني آخر.");
            return;
        }

        await setDoc(userRef, {
            username: username,
            email: email,
            score: 0,
            solvedDays: {}
        });

        alert("تم إنشاء الحساب بنجاح!");
        localStorage.setItem("username", username);
        window.location.href = "play.html";
    } catch (error) {
        console.error("Error during signup:", error);
        alert("حدث خطأ أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى.");
    }
});