import { swapCoins, updateSwapRate } from "./swap.js";
import { COINS } from "./settings.js";

document.addEventListener("DOMContentLoaded", () => {
    // swapCoins();
});

document.querySelector("#swapBtn").addEventListener("click", async () => {
    const fromCoin = document.querySelector("#fromCoinInput").value;
    const toCoin = document.querySelector("#toCoinInput").value;
    const amount = parseFloat(document.querySelector("#fromCoin").value);

    const result = swapCoins(fromCoin, toCoin, amount);

    if (result) {
        alert(`Coins successfully changed ${result.from.amount} ${result.from.coin} on ${result.to.amount.toFixed(6)} ${result.to.coin}`);
        renderWallet();
    }
});


function renderWallet() {

}

document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", function () {
        const dropdown = this.closest(".dropdown");

        const dropdownBtn = dropdown.querySelector(".dropdown-toggle");
        const hiddenInput = dropdown.querySelector("input[type=hidden]");
        const icon = this.getAttribute("data-icon");
        const label = this.getAttribute("data-label");
        const value = this.getAttribute("data-value");

        dropdownBtn.innerHTML = `<img src="${icon}" alt="${COINS[label].name}" width="20"> ${label}`;
        dropdownBtn.dataset.value = value;

        if (hiddenInput) hiddenInput.value = value;

        updateSwapRate();

        console.log("Chose:", value, "in dropdown:", dropdownBtn.id);
    });
});