document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('selectstart', event => event.preventDefault());

let balance = parseInt(localStorage.getItem("balance")) || 0;
let clickValue = 1;
let upgradeLevel = 1;
let upgradeCost = 1000;
let lastCollectedDay = parseInt(localStorage.getItem("lastCollectedDay")) || 0; // Ensure it's a number
let now = new Date().getDate();
let level = parseInt(localStorage.getItem("level")) || 1; // Store and retrieve level
let milestones = [5000, 10000, 20000, 40000, 80000];
let playerNickname = localStorage.getItem("playerNickname") || "";
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []; // Initialize as an empty array if null
let bonusCollectedToday = localStorage.getItem("bonusCollectedToday") === "true"; // Convert string to boolean

// Initial UI Updates
document.getElementById("balance").textContent = balance;
document.getElementById("level").textContent = level; // Display initial level
document.getElementById("upgradeCost").textContent = upgradeCost;

// Nickname handling
if (playerNickname) {
    document.getElementById("nicknamePopup").classList.add("hidden");
    document.getElementById("playerNickname").textContent = playerNickname;
    document.querySelector(".container").classList.remove("hidden");
} else {
    document.getElementById("nicknamePopup").classList.remove("hidden");
    document.querySelector(".tabs").style.pointerEvents = "none";
    document.getElementById("clickButton").style.pointerEvents = "none";
}

function startGame() {
    playerNickname = document.getElementById("nicknameInput").value.trim();
    if (playerNickname === "") {
        alert("Пожалуйста, введите ваш ник!");
        return;
    }
    if (playerNickname.length > 16) {
        alert("Ник не должен превышать 16 символов!");
        return;
    }
    localStorage.setItem("playerNickname", playerNickname);
    document.getElementById("nicknamePopup").classList.add("hidden");
    document.getElementById("playerNickname").textContent = playerNickname;
    document.querySelector(".container").classList.remove("hidden");
    document.querySelector(".tabs").style.pointerEvents = "auto";
    document.getElementById("clickButton").style.pointerEvents = "auto";

    if (!leaderboard.find(player => player.nickname === playerNickname)) {
        leaderboard.push({ nickname: playerNickname, balance: 0, telegram: "" });
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }
    showTab('clicker');
}

document.getElementById("clickButton").addEventListener("click", (event) => {
    balance += clickValue;
    localStorage.setItem("balance", balance); // Save balance
    document.getElementById("balance").textContent = balance;
    spawnParticles(event.clientX, event.clientY, clickValue);
    updateProgress();
    updateLeaderboard();
});

function spawnParticles(x, y, amount) {
    let particle = document.createElement("div");
    particle.className = "particle";
    particle.textContent = `+${amount}`;
    document.body.appendChild(particle);

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    setTimeout(() => particle.remove(), 1000);
}

function showTab(tab) {
    document.getElementById("checkinTab").classList.toggle("hidden", tab !== "checkin");
    document.getElementById("upgradesTab").classList.toggle("hidden", tab !== "upgrades");
    document.getElementById("leaderboardTab").classList.toggle("hidden", tab !== "leaderboard");
    document.querySelector(".container").classList.toggle("hidden", tab !== "clicker");

    if (tab === "leaderboard") {
        updateLeaderboardUI();
    }

    if (tab === "checkin") {
        updateBonusUI();
    }
}

document.getElementById("upgradeButton").addEventListener("click", () => {
    if (balance >= upgradeCost) {
        balance -= upgradeCost;
        localStorage.setItem("balance", balance); // Save balance
        clickValue++;
        upgradeLevel++;
        upgradeCost += 500;
        document.getElementById("balance").textContent = balance;
        document.getElementById("upgradeCost").textContent = upgradeCost;
        updateProgress();
        updateLeaderboard();
    } else {
        alert("Не хватает монет!");
    }
});

function updateProgress() {
    let milestone = milestones.find(m => balance < m) || milestones[milestones.length - 1];
    let progress = (balance / milestone) * 100;
    document.getElementById("progressBar").style.width = `${progress}%`;

    if (balance >= milestone) {
        level++;
        localStorage.setItem("level", level); // Save level
        balance += milestone; // Grant reward for reaching the milestone
        localStorage.setItem("balance", balance);
        document.getElementById("balance").textContent = balance;  // Update balance display after reward
        document.getElementById("level").textContent = level;
        alert(`Поздравляем! Вы достигли ${level}-го уровня и получили ${milestone} монет!`);

        // Check if there are more milestones, otherwise keep the progress at 100%
        if (milestones.indexOf(milestone) < milestones.length - 1) {
             updateProgress(); // Recalculate progress for the next milestone
        }
        else {
             document.getElementById("progressBar").style.width = "100%";
        }

    }
}


let bonuses = [100, 200, 300, 400, 500, 600, 1000];

// Check if it's a new day and reset bonus if needed
if (now !== lastCollectedDay) {
    localStorage.setItem("lastCollectedDay", now);
    bonusCollectedToday = false;
    localStorage.setItem("bonusCollectedToday", bonusCollectedToday);
}

function collectBonus() {
    if (!bonusCollectedToday) {
        let dayIndex = now % 7;  //Correctly calculates the index
        balance += bonuses[dayIndex];
        localStorage.setItem("balance", balance);
        document.getElementById("balance").textContent = balance;
        bonusCollectedToday = true;
        localStorage.setItem("bonusCollectedToday", bonusCollectedToday);
        updateBonusUI(); // Update UI after collecting
        updateLeaderboard();
    } else {
        alert("Вы уже забрали бонус сегодня!");
    }
}

function updateBonusUI() {
    let bonusCards = document.getElementById("bonusCards");
    bonusCards.innerHTML = "";

    bonuses.forEach((amount, index) => {
        let card = document.createElement("div");
        card.className = "bonus-card";
        card.textContent = `День ${index + 1}: ${amount} монет`;

        if (index === now % 7 && !bonusCollectedToday) {
            let btn = document.createElement("button");
            btn.textContent = "Забрать";
            btn.onclick = collectBonus;
            card.appendChild(btn);
        }

        bonusCards.appendChild(card);
    });

    // Timer update
    let nextBonusTime = new Date();
    nextBonusTime.setHours(24, 0, 0, 0); // Set to midnight tomorrow
    let diff = nextBonusTime - new Date();
    let hours = Math.floor(diff / 3600000);
    let minutes = Math.floor((diff % 3600000) / 60000);
    document.getElementById("timer").textContent = `Следующий бонус через: ${hours}ч ${minutes}м`;
}

function updateLeaderboard() {
    let player = leaderboard.find(player => player.nickname === playerNickname);
    if (player) {
        player.balance = balance;
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }
}

function updateLeaderboardUI() {
    let leaderboardContent = document.getElementById("leaderboardContent");
    leaderboardContent.innerHTML = "";
    // Sort and create entries
    leaderboard.sort((a, b) => b.balance - a.balance).forEach((player, index) => {
        let entry = document.createElement("div");
        entry.textContent = `${index + 1}. ${player.nickname}: ${player.balance} монет`;
        leaderboardContent.appendChild(entry);
    });
}

function downloadLeaderboard() {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leaderboard));
    let downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "leaderboard.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
}

updateBonusUI();  // Call this on page load as well