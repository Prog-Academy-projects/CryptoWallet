import { renderCoinsList, swapCoins, updateSwapRate, updateConvertedAmount } from "./swap.js";
import { COINS } from "./settings.js";

document.addEventListener("DOMContentLoaded", () => {
    renderCoinsList();
});


// document.querySelectorAll(".dropdown-item").forEach(item => {
//     debugger
//     item.addEventListener("click", function() {
document.body.addEventListener("click", async function(e) {
    if (e.target.closest(".dropdown-item")) {
        const item = e.target.closest(".dropdown-item");
        const dropdown = item.closest(".dropdown");

        const dropdownBtn = dropdown.querySelector(".dropdown-toggle");
        const hiddenInput = dropdown.querySelector("input[type=hidden]");
        const icon = item.getAttribute("data-icon");
        const label = item.getAttribute("data-label");
        const value = item.getAttribute("data-value");

        dropdownBtn.innerHTML = `<img src="${icon}" alt="${COINS[label].name}" width="20"> ${label}`;
        dropdownBtn.dataset.value = value;

        if (hiddenInput) hiddenInput.value = value;

        await updateSwapRate();

        console.log("Chose:", value, "in dropdown:", dropdownBtn.id);
    };
});

document.getElementById("fromCoin").addEventListener("change", (event) => {
    console.log(event.target.value)
    updateConvertedAmount(event.target.value)
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