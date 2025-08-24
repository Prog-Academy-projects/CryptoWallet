import { getWallet, saveWallet } from "./wallet.js";
import { getCryptoRates } from "./api-coingecko/crypto-rates.js";
import { COINS } from "./settings.js";

export async function swapCoins(fromCoin, toCoin, amount) {
    // const fromSymbol = COINS_BY_SYMBOL[fromCoin].
    // console.log(fromSymbol)
    debugger
    if (fromCoin === toCoin) {
        alert("Can't change the same coins");
        return;
    }

    if (amount <= 0) {
        alert("Enter amount more 0.");
        return;
    }

    const wallet = getWallet();

    if (!wallet[fromCoin] || wallet[fromCoin] < amount) {
        alert(`Not enough amount on balance of ${fromCoin}`);
        return;
    }

    const rates = await getCryptoRates();

    // 5. Берём курсы в USD (например rates = [{symbol:"BTC", usd:65000}, ...])
    const fromRate = rates.find(r => r.symbol.toLowerCase() === COINS[fromCoin]).usd;
    const toRate   = rates.find(r => r.symbol.toLowerCase() === COINS[toCoin]).usd;

    // 6. Считаем сколько получаем
    const usdValue = amount * fromRate;          // сколько $ отдаём
    const toAmount = usdValue / toRate;          // сколько монет получаем

    // 7. Обновляем кошелёк
    wallet[fromCoin] -= amount;
    wallet[toCoin] = (wallet[toCoin] || 0) + toAmount;

    // 8. Сохраняем
    saveWallet(wallet);

    // 9. Возвращаем для отображения
    return {
        from: { coin: fromCoin, amount },
        to: { coin: toCoin, amount: toAmount }
    };
}

export function updateSwapRate() {
    const fromCoin = document.querySelector("#fromCoinDropdown").dataset.value || "ETH";
    const toCoin = document.querySelector("#toCoinDropdown")?.dataset.value || "USDT";

    const rateBlock = document.querySelector(".swap-rate");
    if (!rateBlock) return;

    const fromSymbolRate = rateBlock.querySelector(".swap-rate-from p:last-child");
    const toSymbolRate = rateBlock.querySelector(".swap-rate-to p:last-child");
    const toValueRate = rateBlock.querySelector(".swap-rate-to p:first-child");

    const fromData = apiData.find(c => r.symbol.toLowerCase() === COINS[fromCoin]);
    const toData = apiData.find(c => r.symbol.toLowerCase() === COINS[toCoin]);
    if (!fromData || !toData) return;

    const rate = fromData.usd / toData.usd;
//   let rate = rates[fromCoin]?.[toCoin];
//   if (!rate) rate = "—";
    fromSymbolRate.textContent = fromCoin;
    toSymbolRate.textContent = toCoin;
    toValueRate.textContent = rate.toFixed(4);

    console.log("from " + fromCoin + " to " + toCoin + " is " + rate)
}

const rates1 = {
  ETH: { USDT: 4000, BTC: 0.065 },
  BTC: { USDT: 60000, ETH: 15.5 },
  USDT: { BTC: 1 / 60000, ETH: 1 / 4000 }
};

