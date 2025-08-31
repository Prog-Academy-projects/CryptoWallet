import { renderWalletCoins, renderBalanceChart, renderMarketRates } from "./wallet.js";
import { showSwapModal } from "./swap-modal.js";

document.addEventListener("DOMContentLoaded", () => {
    renderWalletCoins();
    renderBalanceChart();
    renderMarketRates();
});

const modal = document.getElementById("swapModal");
const marketRates = document.getElementById("marketRates");
const span = document.getElementsByClassName("close")[0];

marketRates.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-small")) {
        const coinId = e.target.id;
        console.log(coinId)
        modal.style.display = "block";
        showSwapModal(coinId);
    }
});

span.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});