import { renderWalletCoins, renderBalanceChart, renderMarketRates } from "./wallet.js";

const test_data = { 
    btc: {
        symbol: 'btc',
        name: 'Bitcoin', 
        usd: 118008.81, 
        usd_market_cap: 2357698682630.9873, 
        usd_24h_vol: 78176387484.51817, 
        usd_24h_change: 3.63727894677354,
        last_updated_at: 1711356300
    },
    eth: {
        symbol: "eth", 
        name: "Ethereum", 
        usd: 4478.5, 
        usd_market_cap: 540494072667.8991,
        last_updated_at: 1755463595,
        usd_24h_change: 0.9992786999192023, 
        usd_24h_vol: 25066598160.54498
    },
    trx: {
        symbol: "trx", 
        name: "Tron", 
        usd: 0.35, 
        usd_market_cap: 33377273199.74825,
        last_updated_at: 1755463597,
        usd_24h_change: 1.15906004594372,
        usd_24h_vol: 863997730.4178143,
    }
};

document.addEventListener("DOMContentLoaded", () => {
    renderWalletCoins();
    renderBalanceChart();
    renderMarketRates();
});
