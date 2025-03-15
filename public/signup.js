import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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
document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username-input").value.trim();
    const email = document.getElementById("email-input").value.trim();

    if (!username || !email) {
        alert("الرجاء ملء جميع الحقول.");
        return;
    }

    try {
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
