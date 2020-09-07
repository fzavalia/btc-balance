const axios   = require("axios").default;
const chalk   = require("chalk")
const cheerio = require("cheerio")
const fs      = require("fs")
const path    = require("path")

async function getUsdArsPrice() {

  const url         = "https://www.dolarhoy.com/cotizaciondolarblue";
  const res         = await axios.get(url);
  const $           = cheerio.load(res.data)
  const [buy, sell] = $("span.pull-right").map((_, e) => parseFloat($(e).text().slice(2))).get()

  return buy + (sell - buy) / 2
}

async function getBtcUsdPrice() {

  const url = "https://api.coindesk.com/v1/bpi/currentprice.json"
  const res = await axios.get(url)

  return res.data.bpi.USD.rate_float
}

async function loadData() {

  const dataPath = path.resolve(__dirname, 'data.json')
  const data     = await fs.promises.readFile(dataPath, { encoding: 'utf-8' })

  return JSON.parse(data)
}

function getPercentage(final, invested) {
  return final > invested ? (final / invested - 1) * 100 : (1 - final / invested) * 100
}

async function renderBalance() {

  const data        = await loadData()
  const investedArs = data.expenses.reduce((acc, next) => acc + next, 0)
  const usdArsPrice = await getUsdArsPrice()
  const btcUsdprice = await getBtcUsdPrice()
  const finalArs    = data.btc * btcUsdprice * usdArsPrice
  const difference  = finalArs - investedArs
  const color       = difference > 0 ? chalk.green : chalk.red

  console.log(`
            |           |
USD         |    ARS    |    ${usdArsPrice.toFixed(2)}
            |           |
BTC         |    ARS    |    ${(btcUsdprice * usdArsPrice).toFixed(2)}
            |    USD    |    ${btcUsdprice.toFixed(2)}
            |           |
Invested    |    ARS    |    ${investedArs.toFixed(2)}
            |    USD    |    ${(investedArs / usdArsPrice).toFixed(2)}
            |           |
Final       |    ARS    |    ${finalArs.toFixed(2)}
            |    USD    |    ${(finalArs / usdArsPrice).toFixed(2)}
            |           |
Diff        |    ARS    |    ${color(`${difference.toFixed(2)} (%${getPercentage(finalArs, investedArs).toFixed(2)})`)}
            |    USD    |    ${color((difference / usdArsPrice).toFixed(2))}
            |           |
`)
}

renderBalance()
