const axios = require("axios").default;
const chalk = require("chalk");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

async function coinGeckoPrice(coin) {
  const url = `https://api.coingecko.com/api/v3/coins/${coin}`;
  const res = await axios.get(url);
  return res.data.market_data.current_price.usd;
}

const prices = {
  BTC: () => coinGeckoPrice("bitcoin"),
  USDT: () => coinGeckoPrice("tether"),
  ETH: () => coinGeckoPrice("ethereum"),
  ADA: () => coinGeckoPrice("cardano"),
  BNB: () => coinGeckoPrice("binancecoin"),
  SWP: () => coinGeckoPrice("swipe"),
  SRM: () => coinGeckoPrice("serum"),
  CRO: () => coinGeckoPrice("crypto-com-chain"),
  blue: async () => {
    const url = "https://www.dolarhoy.com/cotizaciondolarblue";
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const [buy, sell] = $("span.pull-right")
      .map((_, e) => parseFloat($(e).text().slice(2)))
      .get();

    return buy + (sell - buy) / 2;
  },
};

async function render() {
  const blue = await prices.blue();

  const dataPath = path.resolve(__dirname, "data.json");
  const dataJson = await fs.promises.readFile(dataPath, { encoding: "utf-8" });
  const data = JSON.parse(dataJson);

  const hydratedCoins = await Promise.all(
    data.coins.map((coin) =>
      prices[coin.name]().then((price) => ({
        ...coin,
        price,
        priceArs: price * blue,
        value: price * coin.amount,
      }))
    )
  );

  const invested = data.expenses.reduce((acc, next) => acc + next, 0);
  const investedValue = hydratedCoins.reduce((acc, next) => acc + next.value, 0);
  const difference = investedValue - invested;
  const color = difference > 0 ? chalk.green : chalk.red;

  console.log();
  console.log(`Invested:   ${(invested).toFixed(2)}`);
  console.log(`Value:      ${(investedValue).toFixed(2)}`);
  console.log(`Difference: ${color((difference).toFixed(2))}`);
  console.log(`Percentage: ${color(`${((Math.abs(difference) * 100) / invested).toFixed(2)} %`)}`);
  console.log();
  console.table(
    hydratedCoins.map((coin) => ({
      name: coin.name,
      price: coin.price.toFixed(2),
      amount: coin.amount.toString(),
      value: coin.value.toFixed(2),
    }))
  );
}

render();
