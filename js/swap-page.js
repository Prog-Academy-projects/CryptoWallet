import { getWallet } from "./wallet.js";
import { renderCoinsList, swapCoins, updateSwapRate, updateConvertedAmount } from "./swap.js";
import { COINS } from "./settings.js";

document.addEventListener("DOMContentLoaded", () => {
    renderCoinsList();
    updatePlaceholder()
});

// ------- Check input amount ------------
document.getElementById("fromCoin").addEventListener("input", validateInput);

// ------- Choose coin from dropdown ------------
document.body.addEventListener("click", async function(e) {
    if (e.target.closest(".dropdown-item")) {
        const item = e.target.closest(".dropdown-item");
        const dropdown = item.closest(".dropdown");

        const dropdownBtn = dropdown.querySelector(".dropdown-toggle");
        const hiddenInput = dropdown.querySelector("input[type=hidden]");
        const icon = item.getAttribute("data-icon");
        const label = item.getAttribute("data-label");
        const value = item.getAttribute("data-value");

        const otherDropdown = dropdownBtn.id.includes("from") 
            ? document.querySelector("#toCoinDropdown") 
            : document.querySelector("#fromCoinDropdown");

        if (otherDropdown && otherDropdown.dataset.value === value) {
            return alert("Please choose different currencies!");
        }

        dropdownBtn.innerHTML = `<img src="${icon}" alt="${COINS[label].name}" width="20"> ${label}`;
        dropdownBtn.dataset.value = value;

        if (hiddenInput) hiddenInput.value = value;

        await updateSwapRate();
        updatePlaceholder();
        resetInputs();
        // validateInput()

        console.log("Chose:", value, "in dropdown:", dropdownBtn.id);
    };
});

// ------- Edit coin ------------
document.getElementById("fromCoin").addEventListener("change", (event) => {
    console.log(event.target.value)
    updateConvertedAmount(event.target.value)
});

// ------- Swap coins ------------
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

function updatePlaceholder() {
    const fromCoin = document.querySelector("#fromCoinDropdown").dataset.value;
    const wallet = getWallet();
    const balance = wallet[fromCoin] || 0;

    const fromInput = document.getElementById("fromCoin");
    fromInput.placeholder = `Max: ${balance}`;
}

function resetInputs() {
    const fromInput = document.getElementById("fromCoin");
    const toInput   = document.getElementById("toCoin");
    fromInput.value = "";
    toInput.value   = "";
    fromInput.classList.remove("is-invalid");
}

function validateInput() {
    const fromCoin = document.querySelector("#fromCoinDropdown").dataset.value;
    const wallet = getWallet();
    const balance = wallet[fromCoin] || 0;
    const fromInput = document.getElementById("fromCoin");
    const value = parseFloat(fromInput.value) || 0;

    if (value > balance) {
        fromInput.classList.add("is-invalid");
    } else {
        fromInput.classList.remove("is-invalid");
    }
}