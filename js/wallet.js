import { COINS } from "./settings.js";

import { renderDoughnutChart } from "./charts/doughnutChart.js";

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

export function getWallet() {
    const walletData = localStorage.getItem(CACHE_KEY);
    return walletData ? JSON.parse(walletData) : defaultWallet;
}

function saveWallet(wallet) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(wallet));
}

export function renderWalletTable() {
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


