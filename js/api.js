import { getCryptoRates } from "./api-coingecko/crypto-rates.js";
import { getMarketChart } from "./api-coingecko/market-chart.js";


if(document.location.pathname === "/index.html"){
    getCryptoRates();
    getMarketChart();
} 
// else if (location.pathname.includes("characters")) {
//     showCharacters();
// }