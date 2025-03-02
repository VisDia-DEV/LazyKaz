let balance = 0;
let upgradeLevel = 1;
let upgradeCost = 1000;
let lastCollectedDay = localStorage.getItem("lastCollectedDay") || 0;
let now = new Date().getDate();
let level = 1;
let milestones = [5000, 10000, 20000, 40000, 80000];

document.getElementById("clickButton").addEventListener("click", (event) => {
    let gain = upgradeLevel;
    balance += gain;
    document.getElementById("balance").textContent = balance;
    spawnParticles(event.clientX, event.clientY, gain);
    updateProgress();
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
}

document.getElementById("upgradeButton").addEventListener("click", () => {
    if (balance >= upgradeCost) {
        balance -= upgradeCost;
        upgradeLevel++;
        upgradeCost += 500;
        document.getElementById("balance").textContent = balance;
        document.getElementById("upgradeCost").textContent = upgradeCost;
        updateProgress();
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
        balance += milestone;
        document.getElementById("level").textContent = level;
        alert(`Поздравляем! Вы достигли ${level}-го уровня и получили ${milestone} монет!`);
    }
}

// Ежедневные бонусы
let bonuses = [100, 200, 300, 400, 500, 600, 1000];

if (now !== lastCollectedDay) {
    localStorage.setItem("lastCollectedDay", now);
}

function collectBonus() {
    let dayIndex = now % 7;
    balance += bonuses[dayIndex];
    document.getElementById("balance").textContent = balance;
    updateBonusUI();
}

function updateBonusUI() {
    let bonusCards = document.getElementById("bonusCards");
    bonusCards.innerHTML = "";
    
    bonuses.forEach((amount, index) => {
        let card = document.createElement("div");
        card.className = "bonus-card";
        card.textContent = `День ${index + 1}: ${amount} монет`;

        if (index === now % 7) {
            let btn = document.createElement("button");
            btn.textContent = "Забрать";
            btn.onclick = collectBonus;
            card.appendChild(btn);
        }

        bonusCards.appendChild(card);
    });

    let nextBonusTime = new Date();
    nextBonusTime.setHours(24, 0, 0, 0);
    let diff = nextBonusTime - new Date();
    let hours = Math.floor(diff / 3600000);
    let minutes = Math.floor((diff % 3600000) / 60000);
    document.getElementById("timer").textContent = `Следующий бонус через: ${hours}ч ${minutes}м`;
}

updateBonusUI();
