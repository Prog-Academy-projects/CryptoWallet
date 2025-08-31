export const COINS_GET_RATE = "btc,eth,trx,xrp,ltc,doge,usdt"; // TO STORE in LocalStorage

export const DEFAULT_WALLET = {
    BTC: 0.23,
    ETH: 2.51,
    LTC: 100,
    DOGE: 10000,
    USDT: 12000
};

export const COINS = {
    BTC: {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        icon: "../assets/img/btc.png",
        color: "#FFA800",
    },
    ETH: {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum",
        icon: "../assets/img/eth.png",
        color: "#3A6FF8",
    },
    TRX: {
        id: "tron",
        symbol: "trx",
        name: "Tron",
        icon: "../assets/img/trx.png",
        color: "#FF073A",
    },
    LTC: {
        id: "litecoin",
        symbol: "ltc",
        name: "Litecoin",
        icon: "../assets/img/ltc.png",
        color: "#64CFF9",
    },
    XRP: {
        id: "ripple",
        symbol: "xrp",
        name: "XRP",
        icon: "../assets/img/xrp.png",
        color: "#346AA9",
    },
    DOGE: {
        id: "dogecoin",
        symbol: "doge",
        name: "Dogecoin",
        icon: "../assets/img/doge.png",
        color: "#DBD42B",
    },
    USDT: {
        id: "tether",
        symbol: "usdt",
        name: "Tether",
        icon: "../assets/img/usdt.png",
        color: "#129B28",
    },
};

export const COINS_BY_ID = Object.fromEntries(
    Object.values(COINS).map(c => [c.id, c])
);

export const COINS_BY_SYMBOL = Object.fromEntries(
    Object.values(COINS).map(c => [c.symbol, c])
);