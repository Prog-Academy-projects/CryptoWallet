import { showDoughnutChart } from "./charts/doughnutChart.js";
import { NAME_BY_SYMBOL, ICON_BY_SYMBOL, COLOR_BY_SYMBOL } from "./settings.js";

const CACHE_KEY = 'wallet';

const defaultWallet = {
    BTC: 0.25,
    ETH: 2.5,
    USDT: 12000
};

const prices = {
    BTC: 65000,
    ETH: 3500,
    USDT: 1
};

export function renderCryptoList(data) {
    const list = document.getElementById("cryptoList");
    list.innerHTML = "";

    // data: { btc: {...}, eth: {...}, ... }
    Object.entries(data).forEach(([symbol, info]) => {
        const sym = symbol.toUpperCase();
        const name = NAME_BY_SYMBOL[sym] || sym;
        const icon = ICON_BY_SYMBOL[sym] || "../assets/img/solana.png";
        const color = COLOR_BY_SYMBOL[sym] || "#999";

        const difference = info.usd_24h_change?.toFixed(2) ?? "0";

        const item = `
            <li class="chart-container ${name.charAt(0).toUpperCase()+name.slice(1)}">
                <nav>
                    <img src="${icon}" alt="${name}">
                    <div>
                        <h4 class="poppins-regular">${name}</h4>
                        <h5 class="poppins-regular" id="curPrice-${symbol.toLowerCase()}">
                            $${info.usd.toLocaleString()}
                        </h5>
                    </div>
                    <div>
                        <p>${sym}</p>
                        <p class="poppins-regular difference-style" 
                           id="curDif-${symbol.toLowerCase()}" 
                           style="color:${difference >= 0 ? "green" : "red"};
                                  text-shadow: 0 0 4px ${difference >= 0 ? "green" : "red"};">
                           ${difference} %
                        </p>
                    </div> 
                </nav>
                <div class="line-chart">
                    <canvas id="lineChart-${symbol.toLowerCase()}"></canvas>
                </div>
            </li>
        `;
        list.insertAdjacentHTML("beforeend", item);

        // 🔹 здесь можно сразу вызвать функцию для отрисовки графика
        renderLineChart(`lineChart-${symbol.toLowerCase()}`, info, color);
    });
}

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

export function renderBalanceChart() {
    const wallet = getWallet();
    const labels = Object.keys(wallet);
    const balances = Object.entries(wallet).map(([coin, amount]) => {
        return amount * (prices[coin] || 0);
    });
    showDoughnutChart(labels, balances);
}
