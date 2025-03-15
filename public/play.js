import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

const days = Array.from({ length: 15 }, (_, i) => i + 15);
const currentDate = new Date();
const currentDay = currentDate.getDate();

const daysGrid = document.getElementById("days-grid");
if (daysGrid) {
    days.forEach(day => {
    const daySquare = document.createElement("div");
    daySquare.className = "day-square";
    daySquare.textContent = `${day} رمضان`;

    if (day !== currentDay) {
        daySquare.classList.add("disabled");
        daySquare.style.pointerEvents = "none";
        daySquare.style.opacity = "0.5";
    }

    daySquare.addEventListener("click", () => showQuestion(day));
    daysGrid.appendChild(daySquare);
});

    loadUserProgress();
} else {
    console.error("Element with ID 'days-grid' not found.");
}

async function loadUserProgress() {
    const username = localStorage.getItem("username");
    if (!username) {
        alert("لم يتم العثور على اسم المستخدم. الرجاء تسجيل الدخول مرة أخرى.");
        return;
    }

    const userRef = doc(db, "Users", username);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const solvedDays = userDoc.data().solvedDays || {};
        Object.keys(solvedDays).forEach(day => {
            const daySquare = Array.from(daysGrid.children).find(el => el.textContent.includes(`${day} رمضان`));
            if (daySquare) {
                daySquare.innerHTML = `${day} رمضان <span class="result-icon">${solvedDays[day] === "correct" ? "✅" : "❌"}</span>`;
                daySquare.classList.add("disabled");
                daySquare.style.pointerEvents = "none";
                daySquare.style.opacity = "0.5";
            }
        });
    }
}

async function showQuestion(day) {
    const questionSection = document.getElementById("question-section");
    const questionTitle = document.getElementById("question-title");
    const questionChoices = document.getElementById("question-choices");

    if (questionSection && questionTitle && questionChoices) {
        questionSection.style.display = "block";

        try {
            const questionRef = doc(db, "Questions", day.toString());
            const questionDoc = await getDoc(questionRef);

            if (questionDoc.exists()) {
                const question = questionDoc.data();
                questionTitle.textContent = question.question;

                questionChoices.innerHTML = "";

                question.choices.forEach(choice => {
                    const label = document.createElement("label");
                    label.innerHTML = `
                        <input type="radio" name="answer" value="${choice}">
                        ${choice}
                    `;
                    questionChoices.appendChild(label);
                });

                const questionForm = document.getElementById("question-form");
                if (questionForm) {
                    questionForm.onsubmit = async (e) => {
                        e.preventDefault();

                        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
                        if (!selectedAnswer) {
                            alert("الرجاء اختيار إجابة.");
                            return;
                        }

                        const daySquare = Array.from(daysGrid.children).find(el => el.textContent.includes(`${day} رمضان`));

                        if (selectedAnswer.value === question.correctAnswer) {
                            alert("إجابة صحيحة! تمت إضافة نقطة إلى حسابك.");
                            await updateUserProgress(day, "correct");
                            if (daySquare) {
                                daySquare.innerHTML = `${day} رمضان <span class="result-icon">✅</span>`;
                                daySquare.classList.add("disabled");
                                daySquare.style.pointerEvents = "none";
                                daySquare.style.opacity = "0.5";
                            }
                        } else {
                            alert("إجابة خاطئة. حاول مرة أخرى!");
                            await updateUserProgress(day, "incorrect");
                            if (daySquare) {
                                daySquare.innerHTML = `${day} رمضان <span class="result-icon">❌</span>`;
                                daySquare.classList.add("disabled");
                                daySquare.style.pointerEvents = "none";
                                daySquare.style.opacity = "0.5";
                            }
                        }

                        questionSection.style.display = "none";
                    };
                }
            } else {
                alert("لم يتم العثور على السؤال.");
            }
        } catch (error) {
            console.error("Error fetching question:", error);
            alert("حدث خطأ أثناء جلب السؤال. الرجاء المحاولة مرة أخرى.");
        }
    }
}

async function updateUserProgress(day, result) {
    const username = localStorage.getItem("username");
    if (!username) {
        alert("لم يتم العثور على اسم المستخدم. الرجاء تسجيل الدخول مرة أخرى.");
        return;
    }

    const userRef = doc(db, "Users", username);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const solvedDays = userDoc.data().solvedDays || {};
        solvedDays[day] = result;
        await updateDoc(userRef, { solvedDays });

        if (result === "correct") {
            const currentScore = userDoc.data().score || 0;
            await updateDoc(userRef, { score: currentScore + 1 });
        }
    } else {
        alert("لم يتم العثور على المستخدم.");
    }
}
