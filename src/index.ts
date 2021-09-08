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
  new Coin("CUSD", "celo-dollar", CoinType.Algorithmic, "images/cusd.png"),
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
const sortByAvgDev = document.getElementById("sortByAvgDev") as HTMLElement;
const sortByMaxDev = document.getElementById("sortByMaxDev") as HTMLElement;
const sortByStable = document.getElementById("sortByStable") as HTMLElement;

const overlayContainer = document.getElementById("overlayContainer") as HTMLElement;
const progressBar = document.getElementById("progressBar") as HTMLElement;
const tbody = document.getElementById("tbody") as HTMLElement;

async function showProgressBar() {
  progressBar.style.width = "0%";
  progressBar.innerHTML = "";
  overlayContainer.style.display = "block";
  overlayContainer.style.opacity = "1";
}

async function hideProgressBar() {
  overlayContainer.style.opacity = "0";
  await new Promise((r) => setTimeout(r, 250));
  overlayContainer.style.display = "none";
}

async function run(days: string) {
  console.log(`Fetching data for the last ${days} days...`);

  tbody.innerHTML = "";
  let count = 0;

  for (const coin of COINS) {
    await coin.fetchData(days);

    count += 1;
    const percentage = ((100 * count) / COINS.length).toFixed(0) + "%";
    progressBar.style.width = percentage;
    progressBar.innerHTML = percentage;

    tbody.innerHTML += coin.generateRow();
  }
}

for (let key in selectors) {
  selectors[key].addEventListener("click", function () {
    Object.values(selectors).forEach((selector) => {
      selector.classList.remove("active");
    });
    selectors[key].classList.add("active");

    showProgressBar();

    run(key).then(() => {
      sortByMarketCap.dispatchEvent(new Event("click"));
      hideProgressBar();
    });
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

sortByAvgDev.addEventListener("click", function () {
  console.log("Sorting by avg dev...");

  tbody.innerHTML = "";

  COINS.sort((a, b) => {
    if (!a.avgDev) return -1;
    if (!b.avgDev) return 1;
    if (a.avgDev > b.avgDev) return 1;
    else return -1;
  });

  COINS.forEach((coin) => {
    tbody.innerHTML += coin.generateRow();
  });
});

sortByMaxDev.addEventListener("click", function () {
  console.log("Sorting by max dev...");

  tbody.innerHTML = "";

  COINS.sort((a, b) => {
    if (!a.maxDev) return -1;
    if (!b.maxDev) return 1;
    if (a.maxDev > b.maxDev) return 1;
    else return -1;
  });

  COINS.forEach((coin) => {
    tbody.innerHTML += coin.generateRow();
  });
});

sortByStable.addEventListener("click", function () {
  console.log("Sorting by stable...");

  tbody.innerHTML = "";

  COINS.sort((a, b) => {
    if (a.stable) return -1;
    else if (b.stable) return 1;
    else return 0;
  });

  COINS.forEach((coin) => {
    tbody.innerHTML += coin.generateRow();
  });
});

selectors["1"].dispatchEvent(new Event("click"));
