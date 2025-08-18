import { renderWalletTable, renderBalanceChart,renderCryptoList } from "./wallet.js";

const test_data = { btc: {
    id: 'bitcoin', 
    symbol: 'btc',
    name: 'Bitcoin', 
    usd: 118008.81, 
    usd_market_cap: 2357698682630.9873, 
    usd_24h_vol: 78176387484.51817, 
    usd_24h_change: 3.63727894677354,
    last_updated_at: 1711356300
}, };

document.addEventListener("DOMContentLoaded", () => {
    renderWalletTable();
    renderBalanceChart();
    renderCryptoList(test_data);
});