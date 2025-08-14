import { getCryptoRates } from "./coingecko/rates.js";
import { getMarketChart } from "./coingecko/chart.js";


if(document.location.pathname === "/index.html"){
    getCryptoRates();
    getMarketChart();
} 
// else if (location.pathname.includes("characters")) {
//     showCharacters();
// }