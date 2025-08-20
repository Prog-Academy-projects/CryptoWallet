import { COINS } from "./settings.js";

import { renderDoughnutChart } from "./charts/doughnutChart.js";
import { createSpan } from "./differ-span.js";

import { getCryptoRates } from "./api-coingecko/crypto-rates.js";

const CACHE_KEY = 'wallet';


// ------------ TEST DATA ------------
const coins_get_rate = "btc,eth,trx,xrp,ltc,doge,usdt"; // TO STORE in LocalStorage
const defaultWallet = {
    BTC: 0.2,
    ETH: 2.5,
    LTC: 100,
    DOGE: 10000,
    USDT: 12000
};
const prices = {
    BTC: 65000,
    ETH: 3500,
    USDT: 1
};

const wallet = getWallet();
const cached = localStorage.getItem('cryptoRates');
const dataRates = JSON.parse(cached).data;

let total_usd_balance = 0;
let total_usd_balance_diff = 0;

export function getWallet() {
    const walletData = localStorage.getItem(CACHE_KEY);
    return walletData ? JSON.parse(walletData) : defaultWallet;
}

function saveWallet(wallet) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(wallet));
}

export function renderWalletCoins() {
    const list = document.getElementById("walletСoins");
    list.innerHTML = "";

    Object.entries(wallet).forEach(([coin, balance]) => {
        const coinRate = dataRates.find(c => c.symbol === COINS[coin].symbol);
        const usd_balance = coinRate.usd*balance
        const usd_balance_2 =  usd_balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        total_usd_balance += usd_balance;

        const usd_balance_diff = usd_balance*coinRate.usd_24h_change/100;
        total_usd_balance_diff += usd_balance_diff;

        console.log(COINS[coin])
        const name = COINS[coin].name || "Solana";
        const symbol = COINS[coin].symbol || "sol";
        const coin_id = COINS[coin].id || "solana"; 
        const icon = COINS[coin].icon || "../assets/img/solana.png";



        const differ = coinRate.usd_24h_change?.toFixed(2) ?? "0";
        const span = createSpan(differ);

        const pattern = `
            <li>
                <img src="${icon}" alt="${coin_id}">
                <div>
                    <h5 class="poppins-medium">${name}</h5>
                    <p class="poppins-regular" id="curPrice-${symbol}">$ ${coinRate.usd.toLocaleString()}</p>
                </div>
                <div>
                    <p>${coin}</p>  
                    <p class="poppins-regular difference-style" id="curDif-${symbol}">${span.outerHTML}</p> 
                </div>
                <div>
                    <h5 class="poppins-medium">${balance}</h5>
                    <p class="poppins-regular" id="totalPrice-${symbol}">$ ${usd_balance_2}</p>
                </div>
            </li>
        `;
        list.insertAdjacentHTML('beforeend', pattern)
    });

    renderBalance();
}

export function renderBalance() {
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

    const span = createSpan(0.2);
    const pattern_curDifBalance = `
        <p>$ ${total_usd_balance_diff.toFixed(2)}(${span.outerHTML})</p>
    `;
    curDifBalance.insertAdjacentHTML('beforeend', pattern_curDifBalance);
}

function renderWalletTable() { // OLD initial version
    const wallet = getWallet();
    const tbody = document.querySelector(".walletBody");
    tbody.innerHTML = "";

    const cached = localStorage.getItem('cryptoRates');
    const dataRates = JSON.parse(cached).data;
    // parsed.data
    const btc = dataRates.find(c => c.symbol === "btc"); 
    console.log(dataRates)

    let total_usd_balance = 0;

    Object.entries(wallet).forEach(([coin, balance]) => {
        const coinRate = dataRates.find(c => c.symbol === COINS[coin].symbol);
        console.log(coinRate.usd);
        const usd_balance = coinRate.usd*balance
        total_usd_balance += usd_balance;

        const pattern = `
            <tr>
                <td><h3>${COINS[coin].name}</h3></td>
                <td>${balance != null ? Number(balance).toLocaleString() : '-'}</td>
                <td>${coinRate.usd}</td>
                <td>${usd_balance != null ? Number(usd_balance).toLocaleString() : '-'}</td>
            </tr>
            <p></p>
        `;
        tbody.insertAdjacentHTML('beforeend', pattern)
    });

    const pattern = `
            <p>${total_usd_balance.toLocaleString()}</p>
        `;
        tbody.insertAdjacentHTML('beforeend', pattern)
}

export function renderBalanceChart() {
    const wallet = getWallet();
    const labels = Object.keys(wallet);
    const balances = Object.entries(wallet).map(([coin, amount]) => {
        return amount * (prices[coin] || 0);
    });
    renderDoughnutChart(labels, balances);
}


// ------------ RENDER RATES ------------
export async function renderRates() {
    const rates = await getCryptoRates(coins_get_rate);
    rates.forEach((obj) => {
        const { symbol, name, usd, usd_market_cap, usd_24h_vol, usd_24h_change, last_updated_at } = obj;
   
        const updatedAt = last_updated_at
        ? new Date(last_updated_at * 1000).toLocaleString()
        : '-';  

        const pattern = `
            <tr>
                <td>${symbol.toUpperCase()}</td>
                <td><h3>${name}</h3></td>
                <td>${usd_24h_vol != null ? Number(usd_24h_vol).toLocaleString() : '-'}</td>
                <td>${usd_24h_change != null 
                        ? usd_24h_change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %' 
                        : '-'}</td>
                <td><h3>${usd != null ? "$ " + Number(usd).toLocaleString() : '-'}</h3><div>Details</div></td>
                <td><h4>⭐ ${usd_market_cap != null ? Number(usd_market_cap).toLocaleString() : '-'}</h4></td>
                <td>${updatedAt}</td>
            </tr>
        `;
        document.querySelector(".cryptoRatesBody").insertAdjacentHTML('beforeend', pattern)
    });
}


