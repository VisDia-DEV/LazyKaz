let balance = 0;
let bonusCollected = false;
let upgradeLevel = 1;
let lastCollectedDay = localStorage.getItem("lastCollectedDay") || 0;

document.getElementById("clickButton").addEventListener("click", () => {
    let gain = upgradeLevel;
    balance += gain;
    document.getElementById("balance").textContent = balance;
    spawnParticles(gain);
});

function spawnParticles(amount) {
    let particle = document.createElement("div");
    particle.className = "particle";
    particle.textContent = `+${amount}`;
    document.querySelector(".particles").appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
}

function showTab(tab) {
    document.getElementById("checkinTab").classList.toggle("hidden", tab !== "checkin");
    document.getElementById("upgradesTab").classList.toggle("hidden", tab !== "upgrades");
}

function buyUpgrade() {
    if (balance >= 50) {
        balance -= 50;
        upgradeLevel++;
        document.getElementById("balance").textContent = balance;
    } else {
        alert("Не хватает монет!");
    }
}

// Ежедневные бонусы
let bonuses = [100, 200, 300, 400, 500, 600, 1000];
let now = new Date().getDate();

if (now !== lastCollectedDay) {
    bonusCollected = false;
}

function collectBonus() {
    if (!bonusCollected) {
        let day = now % 7;
        balance += bonuses[day];
        document.getElementById("balance").textContent = balance;
        bonusCollected = true;
        lastCollectedDay = now;
        localStorage.setItem("lastCollectedDay", now);
        updateBonusUI();
    }
}

function updateBonusUI() {
    let bonusCards = document.getElementById("bonusCards");
    bonusCards.innerHTML = "";
    bonuses.forEach((amount, index) => {
        let card = document.createElement("div");
        card.className = "bonus-card";
        card.textContent = `День ${index + 1}: ${amount} монет`;
        if (index === now % 7 && !bonusCollected) {
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
