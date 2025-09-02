import { getWallet } from "./wallet.js";
import { renderCoinsList, swapCoins, updateSwapRate, updateConvertedAmount } from "./swap.js";
import { COINS } from "./settings.js";


export function initSwapPage(modalEl) {

// document.addEventListener("DOMContentLoaded", () => {
    renderCoinsList();
    updateSwapRate();
    updatePlaceholder(modalEl);
// });

// ------- Check input amount ------------
    modalEl.querySelector("#fromCoin").addEventListener("input", (event) => {
        validateInput(modalEl);
        updateConvertedAmount(event.target.value)
    });

// ------- Choose coin from dropdown ------------
    modalEl.addEventListener("click", async function(e) {
        if (e.target.closest(".dropdown-item")) {
            const item = e.target.closest(".dropdown-item");
            const dropdown = item.closest(".dropdown");

            const dropdownBtn = dropdown.querySelector(".dropdown-toggle");
            const hiddenInput = dropdown.querySelector("input[type=hidden]");
            const icon = item.getAttribute("data-icon");
            const label = item.getAttribute("data-label");
            const value = item.getAttribute("data-value");

            const otherDropdown = dropdownBtn.id.includes("from") 
                ? modalEl.querySelector("#toCoinDropdown") 
                : modalEl.querySelector("#fromCoinDropdown");

            if (otherDropdown && otherDropdown.dataset.value === value) {
                return alert("Please choose different currencies!");
            }

            dropdownBtn.innerHTML = `<img src="${icon}" alt="${COINS[label].name}" width="20"> ${label}`;
            dropdownBtn.dataset.value = value;

            if (hiddenInput) hiddenInput.value = value;

            await updateSwapRate();
            resetInputs(modalEl);
            updatePlaceholder(modalEl);
            validateInput(modalEl);
        };
    });

// ------- Swap coins ------------
    modalEl.querySelector("#swapBtn").addEventListener("click", async () => {
        const fromCoin = modalEl.querySelector("#fromCoinInput").value;
        const toCoin = modalEl.querySelector("#toCoinInput").value;
        const amount = parseFloat(modalEl.querySelector("#fromCoin").value);

        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Enter a valid amount to swap!");
            return;
        }
        const result = await swapCoins(fromCoin, toCoin, amount);

        if (!result) {
            alert("Swap failed! Please check your balance or try again.");
            return;
        }
        
        alert(`Coins successfully changed ${result.from.amount} ${result.from.coin} on ${result.to.amount.toFixed(6)} ${result.to.coin}`);
        
    });
}

function updatePlaceholder(modalEl) {
    const fromCoin = modalEl.querySelector("#fromCoinDropdown").dataset.value;
    const wallet = getWallet();
    const balance = wallet[fromCoin] || 0;

    modalEl.querySelector("#fromCoin").placeholder = `Max: ${balance}`;
}

function resetInputs(modalEl) {
    const fromInput = modalEl.querySelector("#fromCoin");
    const toInput   = modalEl.querySelector("#toCoin");
    fromInput.value = "";
    toInput.value   = "";
    fromInput.classList.remove("is-invalid");
}

function validateInput(modalEl) {
    const fromCoin = modalEl.querySelector("#fromCoinDropdown").dataset.value;
    const wallet = getWallet();
    const balance = wallet[fromCoin] || 0;
    const fromInput = modalEl.querySelector("#fromCoin");
    const value = parseFloat(fromInput.value) || 0;

    if (value > balance) {
        fromInput.classList.add("is-invalid");
    } else {
        fromInput.classList.remove("is-invalid");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#swap")) {
        initSwapPage(document);
    }
});