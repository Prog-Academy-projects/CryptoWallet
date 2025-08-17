import { showDoughnutChart } from "./charts/doughnutChart.js";

const CACHE_KEY = 'wallet';

const defaultWallet = {
    BTC: 0.25,
    ETH: 2.5,
    USDT: 12000
};


function getWallet() {
    const walletData = localStorage.getItem(CACHE_KEY);
    return walletData ? JSON.parse(walletData) : defaultWallet;
}

function saveWallet(wallet) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(wallet));
}

console.log(getWallet())

export function renderWalletTable() {
    const wallet = getWallet();
    const tbody = document.querySelector(".walletBody");
    tbody.innerHTML = "";

    Object.entries(wallet).forEach(([coin, balance]) => {
        const pattern = `
            <tr>
                <td><h3>${coin}</h3></td>
                <td>${balance != null ? Number(balance).toLocaleString() : '-'}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', pattern)
    });
}

function renderBalanceChart(prices) {
    const wallet = getWallet();
    const labels = Object.keys(wallet);
    const balances = Object.entries(wallet).map(([coin, amount]) => {
        return amount * (prices[coin] || 0);
    });
    showDoughnutChart(labels, balances);
}
// renderBalanceChart()

const prices = {
    BTC: 65000,
    ETH: 3500,
    USDT: 1
};

// при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    renderWalletTable();
    renderBalanceChart(prices);
});

// document.querySelector("#getWallet").addEventListener("click", renderWalletTable())
// document.querySelector("#getChart").addEventListener("click", renderBalanceChart())
