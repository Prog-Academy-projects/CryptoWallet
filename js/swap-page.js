import { getWallet } from "./wallet.js";
import { renderCoinsList, swapCoins, updateSwapRate, updateConvertedAmount } from "./swap.js";
import { COINS } from "./settings.js";

document.addEventListener("DOMContentLoaded", () => {
    renderCoinsList();
});

const fromInput = document.getElementById("fromCoin");

fromInput.addEventListener("input", () => {
    const fromCoin = document.querySelector("#fromCoinDropdown").dataset.value;
    const wallet = getWallet();
    const balance = wallet[fromCoin] || 0;
    const value = parseFloat(fromInput.value) || 0;

    if (value > balance) {
        fromInput.classList.add("is-invalid");
    } else {
        fromInput.classList.remove("is-invalid");
    }
});

document.body.addEventListener("click", function(e) {
    if (e.target.closest(".dropdown-item")) {
        const item = e.target.closest(".dropdown-item");
        const dropdown = item.closest(".dropdown");

        const dropdownBtn = dropdown.querySelector(".dropdown-toggle");
        const hiddenInput = dropdown.querySelector("input[type=hidden]");
        const icon = item.getAttribute("data-icon");
        const label = item.getAttribute("data-label");
        const value = item.getAttribute("data-value");

        const otherDropdown = dropdown.id.includes("from") 
            ? document.querySelector("#toCoinDropdown") 
            : document.querySelector("#fromCoinDropdown");

        if (otherDropdown && otherDropdown.dataset.value === value) {
            return alert("Please choose different currencies!");
        }

        dropdownBtn.innerHTML = `<img src="${icon}" alt="${COINS[label].name}" width="20"> ${label}`;
        dropdownBtn.dataset.value = value;

        if (hiddenInput) hiddenInput.value = value;

        updateSwapRate();

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