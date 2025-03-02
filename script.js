document.addEventListener("DOMContentLoaded", function () {
    let balance = localStorage.getItem("balance") || 0;
    let lastCheckIn = localStorage.getItem("lastCheckIn") || "";
    let streak = localStorage.getItem("streak") || 0;
    let clickValue = localStorage.getItem("clickValue") || 10;

    balance = parseInt(balance);
    streak = parseInt(streak);
    clickValue = parseInt(clickValue);

    document.getElementById("balance").textContent = balance;
    document.getElementById("clickValue").textContent = clickValue;

    // Кликер
    const clickerButton = document.getElementById("clicker");
    clickerButton.addEventListener("click", function () {
        balance += clickValue;
        localStorage.setItem("balance", balance);
        document.getElementById("balance").textContent = balance;

        // Анимация клика
        clickerButton.classList.add("click-effect");
        setTimeout(() => clickerButton.classList.remove("click-effect"), 200);
    });

    // Логика Check-in
    function getBonus(streak) {
        return 1000 + (streak * 500);
    }

    let today = new Date().toDateString();
    if (lastCheckIn !== today) {
        document.getElementById("dailyBonus").textContent = getBonus(streak);
        document.getElementById("claimBonus").disabled = false;
    } else {
        document.getElementById("claimBonus").disabled = true;
    }

    document.getElementById("claimBonus").addEventListener("click", function () {
        balance += getBonus(streak);
        localStorage.setItem("balance", balance);
        document.getElementById("balance").textContent = balance;

        streak = Math.min(streak + 1, 7); // Максимальная серия 7 дней
        localStorage.setItem("streak", streak);
        localStorage.setItem("lastCheckIn", today);

        document.getElementById("claimBonus").disabled = true;
    });

    // Магазин улучшений
    document.getElementById("upgradeClick").addEventListener("click", function () {
        if (balance >= 500) {
            balance -= 500;
            clickValue += 5; // Увеличиваем силу клика
            localStorage.setItem("balance", balance);
            localStorage.setItem("clickValue", clickValue);

            document.getElementById("balance").textContent = balance;
            document.getElementById("clickValue").textContent = clickValue;
        } else {
            alert("Недостаточно монет!");
        }
    });

    // Функция переключения страниц
    window.showPage = function (page) {
        document.querySelectorAll(".page").forEach(p => p.classList.remove("show"));
        document.getElementById(page).classList.add("show");
    };

    // Показываем главную страницу по умолчанию
    showPage("clicker-page");
});
