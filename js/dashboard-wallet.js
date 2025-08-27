import { COINS } from "./settings.js";

import { getRatesCached } from "./api-coingecko/crypto-rates.js";

import { renderDoughnutChart } from "./charts/doughnutChart.js";
import { createSpan } from "./differ-span.js";

import { getWallet } from "./wallet.js";


const wallet = getWallet();
const dataRates = await getRatesCached();

let total_usd_balance = 0;

// ------------- render Balance Chart -----------------
export async function renderBalanceChart() {
    const labels = Object.keys(wallet);
    const balances = Object.entries(wallet).map(([coin, amount]) => {
        const coinRate = dataRates.find(c => c.symbol === COINS[coin].symbol);
        return amount * (coinRate.usd || 0);
    });
    renderDoughnutChart(labels, balances);
}

// ------------- render Wallet Coins -----------------
export async function renderWalletCoins() {
    const list = document.getElementById("walletСoins");
    list.innerHTML = "";

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
        const span = createSpan(null, differ);

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

    renderBalance();
}

// ------------- render Balance -----------------
export function renderBalance() {
    const curBalance = document.getElementById("curBalance");
    curBalance.innerHTML = "";
    const pattern = `
        <p>$ ${total_usd_balance.toLocaleString()}</p>
    `;
    curBalance.insertAdjacentHTML('beforeend', pattern)
}