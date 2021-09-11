import axios from "axios";

function _formatInteger(int: number) {
  return Math.floor(int)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function _formatMoney(amount: number, denom = "", decPlaces = 2) {
  const dec = amount % 1;
  return (
    denom +
    _formatInteger(amount) +
    (decPlaces > 0 ? dec.toFixed(decPlaces).slice(1) : "")
  );
}

function _calculateAvgDev(numbers: number[], _mean?: number) {
  const mean = _mean ? _mean : numbers.reduce((a, b) => a + b, 0) / numbers.length;
  return Math.sqrt(
    numbers.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / numbers.length
  );
}

function _calculateMaxDev(numbers: number[], _mean?: number) {
  const mean = _mean ? _mean : numbers.reduce((a, b) => a + b, 0) / numbers.length;
  return Math.sqrt(Math.max(...numbers.map((x) => Math.pow(x - mean, 2))));
}

function _generateTag(type: CoinType) {
  switch (type) {
    case CoinType.Centralized:
      return '<span class="tag tag-centralized">centralized</span>';
    case CoinType.Decentralized:
      return '<span class="tag tag-decentralized">decentralized</span>';
    case CoinType.Mixed:
      return '<span class="tag tag-mixed">mixed</span>';
    case CoinType.Algorithmic:
      return '<span class="tag tag-algorithmic">algorithmic</span>';
    case CoinType.Unknown:
      return '<span class="tag tag-unknown">unknown</span>';
  }
}

export enum CoinType {
  Centralized,
  Decentralized,
  Mixed,
  Algorithmic,
  Unknown,
}

export class Coin {
  name: string;
  coingeckoId: string;
  type: CoinType;
  icon: string | undefined;
  targetPrice: number = 1;
  currentPrice: number | undefined = undefined;
  currentMarketCap: number | undefined = undefined;
  historicalPrices: number[] | undefined = undefined;
  avgDev: number | undefined = undefined;
  maxDev: number | undefined = undefined;
  stable: boolean = false;

  constructor(name: string, coingeckoId: string, type: CoinType, icon?: string) {
    this.name = name;
    this.coingeckoId = coingeckoId;
    this.type = type;
    this.icon = icon;
  }

  async fetchData(days: string) {
    console.log(`Attempting to fetch data for ${this.name}...`);

    try {
      const data: {
        prices: number[][];
        market_caps: number[][];
      } = (
        await axios.get(
          `https://api.coingecko.com/api/v3/coins/${this.coingeckoId}/market_chart?vs_currency=usd&days=${days}}`
        )
      ).data;

      data.prices.sort((a, b) => {
        if (a[0] > b[0]) return -1;
        else return 1;
      });

      data.market_caps.sort((a, b) => {
        if (a[0] > b[0]) return -1;
        else return 1;
      });

      this.currentPrice = data.prices[0][1];
      this.currentMarketCap = data.market_caps[0][1];
      this.historicalPrices = data.prices.map((x) => x[1]);

      // // DEBUG MOD: just generate some random numbers
      // this.currentPrice = Math.random();
      // this.currentMarketCap = Math.random() * 1000000;
      // this.historicalPrices = [Math.random(), Math.random(), Math.random()];

      this.avgDev = _calculateAvgDev(this.historicalPrices, this.targetPrice);
      this.maxDev = _calculateMaxDev(this.historicalPrices, this.targetPrice);

      this.stable =
        this.avgDev <= 0.005 * this.targetPrice &&
        this.maxDev <= 0.015 * this.targetPrice;

      console.log(`Successfully fetched data for ${this.name}!`);
      // console.log(`Historical prices of ${this.name}`, this.historicalPrices);
    } catch (e) {
      console.log(`Failed to fetch data for ${this.name}! Error message: ${e}`);
    }
  }

  generateIcon() {
    return (
      '<div class="d-flex align-items-center">' +
      (this.icon ? `<img class="icon me-3" src="${this.icon}" />` : "") +
      this.name +
      "</div>"
    );
  }

  generateRow() {
    console.log(`Generating row for ${this.name}...`);

    return (
      '<tr class="align-middle">' +
      `<td>${this.generateIcon()}</td>` +
      `<td>${_generateTag(this.type)}</td>` +
      `<td>${
        this.currentMarketCap ? _formatMoney(this.currentMarketCap, "", 0) : "?"
      }</td>` +
      `<td>${this.currentPrice ? this.currentPrice.toPrecision(3) : "?"}</td>` +
      `<td class="${
        this.avgDev && this.avgDev <= 0.005 * this.targetPrice ? "text-success" : ""
      }">${this.avgDev ? this.avgDev.toPrecision(3) : "?"}</td>` +
      `<td class="${
        this.maxDev && this.maxDev < 0.015 * this.targetPrice ? "text-success" : ""
      }">${this.maxDev ? this.maxDev.toPrecision(3) : "?"}</td>` +
      `<td>${this.stable ? "✅" : ""}</td>` +
      "</tr>"
    );
  }
}
