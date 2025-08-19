import { COINS, COINS_BY_ID, COINS_BY_SYMBOL } from "./settings.js";

import { renderDoughnutChart } from "./charts/doughnutChart.js";

import { getWallet } from "./wallet.js";


const wallet = getWallet();
const cached = localStorage.getItem('cryptoRates');
const dataRates = JSON.parse(cached).data;

export function renderBalanceChart() {
    const labels = Object.keys(wallet);
    const balances = Object.entries(wallet).map(([coin, amount]) => {
        const coinRate = dataRates.find(c => c.symbol === COINS[coin].symbol);
        return amount * (coinRate.usd || 0);
    });
    renderDoughnutChart(labels, balances);
}

export function renderWalletCoins() {
    const list = document.getElementById("walletСoins");
    list.innerHTML = "";

    let total_usd_balance = 0;

    Object.entries(wallet).forEach(([coin, balance]) => {
        const coinRate = dataRates.find(c => c.symbol === COINS[coin].symbol);
        const usd_balance = coinRate.usd*balance
        total_usd_balance += usd_balance;

        console.log(COINS[coin])
        const name = COINS[coin].name || "Solana";
        const symbol = COINS[coin].symbol || "sol";
        const coin_id = COINS[coin].id || "solana"; 
        const icon = COINS[coin].icon || "../assets/img/solana.png";

        const differ = coinRate.usd_24h_change?.toFixed(2) ?? "0";
        const span = document.createElement("span");
        span.textContent = differ.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + "%";

        const green = "#2FA15D";
        const red = "#A13D2F";

        if (differ > 0) {
            span.style.color = `${green}`;
            span.style.textShadow = `0 0 5px ${green}`;
            span.insertAdjacentHTML('afterbegin',
                `<svg class="icon" style="filter: drop-shadow(0px 0px 5px ${green})"><use href="../assets/icons/arrow-up-right.svg"></use></svg>`)
        } else if (differ < 0) {
            span.style.color = `${red}`;
            span.style.textShadow = `0 0 5px ${red}`;
            span.insertAdjacentHTML('afterbegin',
                `<svg class="icon" style="filter: drop-shadow(0px 0px 5px ${red})"><use href="../assets/icons/arrow-down-left.svg"></use></svg>`)
        } else {    
            span.style.color = "gray";
            span.style.textShadow = "0 0 5px gray";
        }

        const pattern = `
            <li class="wallet-coin">
                <img src="${icon}" alt="${coin_id}">
                <div>
                    <h5 class="poppins-medium">${name}</h5>
                    <div>
                        <p>${coin}</p>  
                        <p class="poppins-regular difference-style" id="curDif-${symbol}">${span.outerHTML}</p> 
                    </div>
                </div> 
            </li>
        `;
        list.insertAdjacentHTML('beforeend', pattern)
    });

    const curBalance = document.getElementById("curBalance");
    curBalance.innerHTML = "";
    const pattern = `
        <p>$ ${total_usd_balance.toLocaleString()}</p>
    `;
    curBalance.insertAdjacentHTML('beforeend', pattern)
}