import { getCryptoRates } from "./api-coingecko/crypto-rates.js";

// ------------ RENDER RATES (by button) ------------
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
                <td>${name}</td>
                <td>⭐ ${usd != null ? "$ " + Number(usd).toLocaleString() : '-'}</td>
                <td>${usd_market_cap != null ? Number(usd_market_cap).toLocaleString() : '-'}</td>
                <td>${usd_24h_vol != null ? Number(usd_24h_vol).toLocaleString() : '-'}</td>
                <td>${usd_24h_change != null 
                        ? usd_24h_change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %' 
                        : '-'}</td>
                <td>${updatedAt}</td>
            </tr>
        `;
        document.querySelector(".cryptoRatesBody").insertAdjacentHTML('beforeend', pattern)
    });
}


document.querySelector("#getCryptoRates").addEventListener("click", renderRates)

// -------- OLD initial version (example) ------------------
function renderWalletTable() { 
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