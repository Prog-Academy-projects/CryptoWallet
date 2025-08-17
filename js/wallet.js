const defaultWallet = {
    BTC: 0.25,
    ETH: 2.5,
    USDT: 1200
};

function getWallet() {
    const wallet = localStorage.getItem("wallet");
    return wallet ? JSON.parse(wallet) : defaultWallet;

}

function saveWallet(wallet) {
    localStorage.setItem("wallet", JSON.stringify(wallet));
}

function showWallet(obj) {
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
    document.querySelector(".walletBody").insertAdjacentHTML('beforeend', pattern)
}

document.querySelector("#getWallet").addEventListener("click", getWallet)
