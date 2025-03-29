import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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
