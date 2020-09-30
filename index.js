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
  bitcoin: () => coinGeckoPrice("bitcoin"),
  tether: () => coinGeckoPrice("tether"),
  ethereum: () => coinGeckoPrice("ethereum"),
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
        valueArs: price * coin.amount * blue,
      }))
    )
  );

  const invested = data.expenses.reduce((acc, next) => acc + next, 0);
  const investedValue = hydratedCoins.reduce((acc, next) => acc + next.valueArs, 0);
  const difference = investedValue - invested;
  const color = difference > 0 ? chalk.green : chalk.red;

  console.log();
  console.log(`Blue:       ${color.blue(blue.toFixed(2))}`);
  console.log(`Invested:   ${invested.toFixed(2)}`);
  console.log(`Value:      ${investedValue.toFixed(2)}`);
  console.log(`Difference: ${color(difference.toFixed(2))}`);
  console.log(`Percentage: ${color(((Math.abs(difference) * 100) / invested).toFixed(2))}`);
  console.log();
  console.table(
    hydratedCoins.map((coin) => ({
      name: coin.name,
      "price USD/ARS": `${coin.price.toFixed(2)} / ${coin.priceArs.toFixed(2)}`,
      amount: `${coin.amount}`,
      "value USD/ARS": `${coin.value.toFixed(2)} / ${coin.valueArs.toFixed(2)}`,
    }))
  );
}

render();
