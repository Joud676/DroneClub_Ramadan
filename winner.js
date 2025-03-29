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
        const q = query(usersRef, orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const winnersContainer = document.getElementById('winners-container');
        winnersContainer.innerHTML = '';

        if (querySnapshot.empty) {
            winnersContainer.innerHTML = '<div class="no-winners">لا يوجد فائزون حتى الآن</div>';
            return;
        }

        const users = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });

        const groupedByScore = {};
        users.forEach(user => {
            const score = user.score || 0;
            if (!groupedByScore[score]) {
                groupedByScore[score] = [];
            }
            groupedByScore[score].push(user);
        });

        const sortedScores = Object.keys(groupedByScore).map(Number).sort((a, b) => b - a);
        
        let currentPosition = 1;
        
        for (let i = 0; i < sortedScores.length && currentPosition <= 3; i++) {
            const score = sortedScores[i];
            const usersWithThisScore = groupedByScore[score];
            
            usersWithThisScore.forEach(user => {
                user.position = currentPosition;
            });
            
            currentPosition += usersWithThisScore.length;
        }

        const medalIcons = [
            '<i class="fas fa-crown gold"></i>',
            '<i class="fas fa-award silver"></i>',
            '<i class="fas fa-award bronze"></i>'
        ];

        const positionClasses = ['position-1', 'position-2', 'position-3'];

        const allUsers = [];
        Object.values(groupedByScore).forEach(group => {
            allUsers.push(...group);
        });

        const topUsers = allUsers.filter(user => user.position <= 3);

        topUsers.sort((a, b) => a.position - b.position || b.score - a.score);

        const positionCounts = {1: 0, 2: 0, 3: 0};

        let animationDelay = 0.2;
        topUsers.forEach(user => {
            const position = user.position;
            positionCounts[position] = positionCounts[position] + 1;
            const isRepeated = positionCounts[position] > 1;
            
            const username = user.username || "مجهول";
            const score = user.score || 0;
            
            const winnerCard = document.createElement('div');
            winnerCard.className = `winner-card ${positionClasses[position - 1] || ''}`;
            winnerCard.style.animationDelay = `${animationDelay}s`;
            animationDelay += 0.2;

            let positionTitle;
            switch(position) {
                case 1:
                    positionTitle = isRepeated ? 'الفائز الأول مكرر' : 'الفائز الأول';
                    break;
                case 2:
                    positionTitle = isRepeated ? 'الفائز الثاني مكرر' : 'الفائز الثاني';
                    break;
                case 3:
                    positionTitle = isRepeated ? 'الفائز الثالث مكرر' : 'الفائز الثالث';
                    break;
                default:
                    positionTitle = '';
            }

            const displayPosition = Math.min(position, 3);
            winnerCard.innerHTML = `
                <div class="winner-medal">${medalIcons[displayPosition - 1] || ''}</div>
                <div class="winner-details">
                    <span class="position-title">${positionTitle}</span>
                    <h3 class="winner-name">${username}</h3>
                    <div class="winner-score-container">
                        <span class="score-label">النقاط:</span>
                        <span class="score-value">${score}</span>
                    </div>
                </div>
                <div class="winner-position">${position}</div>
            `;

            winnersContainer.appendChild(winnerCard);
        });

    } catch (error) {
        console.error("Error fetching winners:", error);
        document.getElementById('winners-container').innerHTML =
            '<div class="error">حدث خطأ أثناء جلب بيانات الفائزين. الرجاء المحاولة مرة أخرى.</div>';
    }
});
