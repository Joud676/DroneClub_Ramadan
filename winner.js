import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

        document.addEventListener('DOMContentLoaded', async () => {
            try {
                const usersRef = collection(db, "Users");
                const q = query(usersRef, orderBy("score", "desc"), limit(3));
                const querySnapshot = await getDocs(q);
                const winnersContainer = document.getElementById('winners-container');
                winnersContainer.innerHTML = '';

                if (querySnapshot.empty) {
                    winnersContainer.innerHTML = '<div class="no-winners">لا يوجد فائزون حتى الآن</div>';
                    return;
                }

                let position = 1;
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    const username = userData.username || "مجهول";
                    const score = userData.score || 0;
                    const winnerCard = document.createElement('div');
                    winnerCard.className = `winner-card position-${position}`;

                    winnerCard.style.animationDelay = `${position * 0.2}s`;

                    const medalIcons = [
                        '<i class="fas fa-crown gold"></i>',
                        '<i class="fas fa-award silver"></i>',
                        '<i class="fas fa-award bronze"></i>'
                    ];

                    const positionTitles = [
                        '<span class="position-title">الفائز الأول</span>',
                        '<span class="position-title">الفائز الثاني</span>',
                        '<span class="position-title">الفائز الثالث</span>'
                    ];

                    winnerCard.innerHTML = `
                        <div class="winner-medal">${medalIcons[position - 1] || ''}</div>
                        <div class="winner-details">
                            ${positionTitles[position - 1] || ''}
                            <h3 class="winner-name">${username}</h3>
                            <div class="winner-score-container">
                                <span class="score-label">النقاط:</span>
                                <span class="score-value">${score}</span>
                            </div>
                        </div>
                        <div class="winner-position">${position}</div>
                    `;

                    winnersContainer.appendChild(winnerCard);
                    position++;
                });
            } catch (error) {
                console.error("Error fetching winners:", error);
                document.getElementById('winners-container').innerHTML =
                    '<div class="error">حدث خطأ أثناء جلب بيانات الفائزين. الرجاء المحاولة مرة أخرى.</div>';
            }
        });
