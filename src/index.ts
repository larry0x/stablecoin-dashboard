import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Coin, CoinType } from "./coin";

const COINS = [
  new Coin("USDT", "tether", CoinType.Centralized, "images/usdt.png"),
  new Coin("USDC", "usd-coin", CoinType.Centralized, "images/usdc.png"),
  new Coin("BUSD", "binance-usd", CoinType.Centralized, "images/busd.png"),
  new Coin("DAI", "dai", CoinType.Mixed, "images/dai.png"),
  new Coin("UST", "terrausd", CoinType.Algorithmic, "images/ust.png"),
  new Coin("TUSD", "true-usd", CoinType.Centralized, "images/tusd.png"),
  new Coin("PAX", "paxos-standard", CoinType.Centralized, "images/pax.png"),
  new Coin("LUSD", "liquity-usd", CoinType.Decentralized, "images/lusd.png"),
  new Coin("USDN", "neutrino", CoinType.Algorithmic, "images/usdn.png"),
  new Coin("HUSD", "husd", CoinType.Centralized, "images/husd.png"),
  new Coin("FEI", "fei-protocol", CoinType.Algorithmic, "images/fei.png"),
  new Coin("FRAX", "frax", CoinType.Mixed, "images/frax.png"),
  new Coin("sUSD", "nusd", CoinType.Decentralized, "images/susd.png"),
  new Coin("alUSD", "alchemix-usd", CoinType.Mixed, "images/alusd.png"),
  new Coin("GUSD", "gemini-dollar", CoinType.Centralized, "images/gusd.png"),
  new Coin("VAI", "vai", CoinType.Mixed, "images/vai.png"),
  new Coin("USDX", "usdx", CoinType.Mixed, "images/usdx.png"),
  new Coin("USDP", "usdp", CoinType.Mixed, "images/usdp.png"),
  new Coin("CUSD", "celo-dollar", CoinType.Centralized, "images/cusd.png"),
  new Coin("mUSD", "musd", CoinType.Mixed, "images/musd.png"),
];

const selectors: { [key: string]: HTMLElement } = {
  "1": document.getElementById("1d") as HTMLElement,
  "7": document.getElementById("7d") as HTMLElement,
  "14": document.getElementById("14d") as HTMLElement,
  "30": document.getElementById("30d") as HTMLElement,
  "90": document.getElementById("90d") as HTMLElement,
  "180": document.getElementById("180d") as HTMLElement,
  "365": document.getElementById("365d") as HTMLElement,
};

const sortByMarketCap = document.getElementById("sortByMarketCap") as HTMLElement;
const sortByCurrentPrice = document.getElementById("sortByCurrentPrice") as HTMLElement;
const sortByStdDev = document.getElementById("sortByStdDev") as HTMLElement;

const tbody = document.getElementById("tbody") as HTMLElement;

async function run(days: string) {
  console.log(`Fetching data for the last ${days} days...`);

  tbody.innerHTML = "";

  COINS.map((coin) => {
    coin.fetchData(days).then(() => {
      tbody.innerHTML += coin.generateRow();
    });
  });
}

for (let key in selectors) {
  selectors[key].addEventListener("click", function () {
    Object.values(selectors).forEach((selector) => {
      selector.classList.remove("active");
    });
    selectors[key].classList.add("active");
    run(key);
  });
}

sortByMarketCap.addEventListener("click", function () {
  console.log("Sorting by market cap...");

  tbody.innerHTML = "";

  COINS.sort((a, b) => {
    if (!a.currentMarketCap) return 1;
    if (!b.currentMarketCap) return -1;
    if (a.currentMarketCap > b.currentMarketCap) return -1;
    else return 1;
  });

  COINS.forEach((coin) => {
    tbody.innerHTML += coin.generateRow();
  });
});

sortByCurrentPrice.addEventListener("click", function () {
  console.log("Sorting by current price...");

  tbody.innerHTML = "";

  COINS.sort((a, b) => {
    if (!a.currentPrice) return 1;
    if (!b.currentPrice) return -1;
    if (a.currentPrice > b.currentPrice) return -1;
    else return 1;
  });

  COINS.forEach((coin) => {
    tbody.innerHTML += coin.generateRow();
  });
});

sortByStdDev.addEventListener("click", function () {
  console.log("Sorting by stddev...");

  tbody.innerHTML = "";

  COINS.sort((a, b) => {
    if (!a.stdDev) return -1;
    if (!b.stdDev) return 1;
    if (a.stdDev > b.stdDev) return 1;
    else return -1;
  });

  COINS.forEach((coin) => {
    tbody.innerHTML += coin.generateRow();
  });
});

selectors["1"].dispatchEvent(new Event("click"));
