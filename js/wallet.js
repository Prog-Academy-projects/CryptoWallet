import { COINS, COINS_GET_RATE, DEFAULT_WALLET} from "./settings.js";

import { getRatesCached } from "./api-coingecko/crypto-rates.js";

import { renderDoughnutChart } from "./charts/doughnutChart.js";
import { createSpan } from "./differ-span.js";

import { getCryptoRates } from "./api-coingecko/crypto-rates.js";

const CACHE_KEY = 'wallet';

const wallet = getWallet();
const dataRates = await getRatesCached();

export function getWallet() {
    const walletData = localStorage.getItem(CACHE_KEY);
    return walletData ? JSON.parse(walletData) : DEFAULT_WALLET;
}

export function saveWallet(wallet) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(wallet));
}

// ------------- render Wallet Coins -----------------
export function renderWalletCoins() {
    let total_usd_balance = 0;
    let total_usd_balance_diff = 0;
    
    const list = document.getElementById("walletСoins");
    list.innerHTML = "";

    console.log("Coins in wallet:")
    Object.entries(wallet).forEach(([coin, balance]) => {
        const coinRate = dataRates.find(c => c.symbol === COINS[coin].symbol);
        const usd_balance = coinRate.usd*balance
        const usd_balance_2 =  usd_balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        const usd_balance_diff = usd_balance * coinRate.usd_24h_change / 100;

        total_usd_balance += usd_balance;
        total_usd_balance_diff += usd_balance_diff;

        console.log(COINS[coin].id)
        const name = COINS[coin].name || "Solana";
        const symbol = COINS[coin].symbol || "sol";
        const coin_id = COINS[coin].id || "solana"; 
        const icon = COINS[coin].icon || "../assets/img/solana.png";

        const differ = coinRate.usd_24h_change?.toFixed(2) ?? "0";
        const span = createSpan(null,differ);

        const pattern = `
            <li>
                <img src="${icon}" alt="${coin_id}">
                <div>
                    <h5 class="poppins-medium">${name}</h5>
                    <p class="poppins-regular" id="curPrice-${symbol}">$${coinRate.usd.toLocaleString()}</p>
                </div>
                <div>
                    <p class="poppins-regular">${coin}</p>  
                    <p class="poppins-regular difference-style" id="curDif-${symbol}">${span.outerHTML}</p> 
                </div>
                <div>
                    <h5 class="poppins-medium">${balance}</h5>
                    <p class="poppins-regular" id="totalPrice-${symbol}">$${usd_balance_2}</p>
                </div>
            </li>
        `;
        list.insertAdjacentHTML('beforeend', pattern)
    });

    renderBalance(total_usd_balance, total_usd_balance_diff);
}

// ------------- render Balance -----------------
export function renderBalance(total_usd_balance, total_usd_balance_diff) {
    const curBalance = document.getElementById("curBalance");
    curBalance.innerHTML = "";
    const pattern_curBalance = `
        <p>$ ${total_usd_balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}</p>
    `;
    curBalance.insertAdjacentHTML('beforeend', pattern_curBalance);
    
    const curDifBalance = document.getElementById("curDifBalance");
    curDifBalance.innerHTML = "";

    const total_usd_change_percent = (total_usd_balance_diff / total_usd_balance) * 100;

    const span = createSpan(total_usd_balance_diff, total_usd_change_percent);
    const pattern_curDifBalance = `
        <p>${span.outerHTML}</p>
    `;
    curDifBalance.insertAdjacentHTML('beforeend', pattern_curDifBalance);
}


// ------------- render Balance Chart -----------------
export function renderBalanceChart() {
    const labels = Object.keys(wallet);
    const balances = Object.entries(wallet).map(([coin, amount]) => {
        const coinRate = dataRates.find(c => c.symbol === COINS[coin].symbol);
        return amount * (coinRate.usd || 0);
    });
    renderDoughnutChart(labels, balances);
}


// ------------ RENDER MARKET RATES (Auto in TABLE) ------------
export async function renderMarketRates() {
    const list = document.getElementById("marketRates");
    list.innerHTML = "";

    let i = 0;

    // const rates = await getCryptoRates(COINS_GET_RATE);
    dataRates.forEach((obj) => {
        const { symbol, name, usd, usd_market_cap, usd_24h_vol, usd_24h_change } = obj;
        i += 1;

        // const differ = coinRate.usd_24h_change?.toFixed(2) ?? "0";
        const differ = usd*usd_24h_change/100;
        const span = createSpan(null, usd_24h_change);

        const pattern = `
            <li class="market-row poppins-regular">
                <div class="poppins-regular">${i}</div>
                <div class="poppins-medium">${name}</div> 
                <div class="poppins-regular">${symbol.toUpperCase()}</div>
                <div class="poppins-regular">${usd != null ? "$" + Number(usd).toLocaleString() : '-'}</div>
                <div class="poppins-regular">${usd_market_cap != null ? "$" + Number(usd_market_cap).toLocaleString(undefined, {maximumFractionDigits: 0}) : '-'}</div>
                <div class="poppins-regular">${usd_24h_vol != null ? "$" + Number(usd_24h_vol).toLocaleString(undefined, {maximumFractionDigits: 0}) : '-'}</div>
                <div class="poppins-regular">${span.outerHTML}</div>
                <div><button class="btn-small" id="${symbol.toUpperCase()}">$</button></div>
            </li>
        `;
        list.insertAdjacentHTML('beforeend', pattern)
    });
}
