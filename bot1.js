const ccxt = require("ccxt");
const math = require("mathjs");
const { DateTime } = require("luxon");
const { checkProfitLoss } = require("./result");
const currentDate = new Date().toLocaleDateString();
const exchange = new ccxt.bybit();
const { ProfitLossData } = require("./db");

async function fetchCurrentTickerPrice(ticker) {
  try {
    const currentTickerDetails = await exchange.fetchTicker(ticker);
    // console.log("working ticker details", currentTickerDetails.symbol);
    const tickerPrice = currentTickerDetails
      ? currentTickerDetails.close
      : null;
    // console.log("loading ticker price", tickerPrice);
    return tickerPrice;
  } catch (error) {
    console.error("Error fetching ticker price:", error);
    return null;
  }
}

function checkIfFloatZero(value) {
  return math.abs(value) < 1e-3;
}

async function checkBuyBuySell(scrip1, scrip2, scrip3, initialInvestment) {
  let finalPrice = 0;
  let scripPrices = {};

  try {
    console.log("buy open");
    let investmentAmount1 = initialInvestment;
    let currentPrice1 = await fetchCurrentTickerPrice(scrip1);

    if (currentPrice1 !== null && !checkIfFloatZero(currentPrice1)) {
      let buyQuantity1 = parseFloat(
        (investmentAmount1 / currentPrice1).toFixed(8)
      );
      await sleep(1000);

      let investmentAmount2 = buyQuantity1;
      let currentPrice2 = await fetchCurrentTickerPrice(scrip2);

      if (currentPrice2 !== null && !checkIfFloatZero(currentPrice2)) {
        let buyQuantity2 = parseFloat(
          (investmentAmount2 / currentPrice2).toFixed(8)
        );
        await sleep(1000);

        let investmentAmount3 = buyQuantity2;
        let currentPrice3 = await fetchCurrentTickerPrice(scrip3);

        if (currentPrice3 !== null && !checkIfFloatZero(currentPrice3)) {
          let sellQuantity3 = buyQuantity2;
          finalPrice = parseFloat((sellQuantity3 * currentPrice3).toFixed(3));
          scripPrices = {
            [scrip1]: currentPrice1,
            [scrip2]: currentPrice2,
            [scrip3]: currentPrice3,
          };
        }
      }
    }
    console.log(finalPrice, "----", scripPrices);
    console.log("buy close");
  } catch (error) {
    console.error("Error occurred in {buybuysell}:", error);
  }

  return { finalPrice, scripPrices };
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkBuySellSell(scrip1, scrip2, scrip3, initialInvestment) {
  let finalPrice = 0;
  let scripPrices = {};

  try {
    console.log("sell open");
    let investmentAmount1 = initialInvestment;
    let currentPrice1 = await fetchCurrentTickerPrice(scrip1);

    if (currentPrice1 !== null && !checkIfFloatZero(currentPrice1)) {
      let buyQuantity1 = parseFloat(
        (investmentAmount1 / currentPrice1).toFixed(8)
      );
      await sleep(1000);

      let investmentAmount2 = buyQuantity1;
      let currentPrice2 = await fetchCurrentTickerPrice(scrip2);

      if (currentPrice2 !== null && !checkIfFloatZero(currentPrice2)) {
        let sellQuantity2 = buyQuantity1;
        let sellPrice2 = parseFloat((sellQuantity2 * currentPrice2).toFixed(8));
        await sleep(1000);

        let investmentAmount3 = sellPrice2;
        let currentPrice3 = await fetchCurrentTickerPrice(scrip3);

        if (currentPrice3 !== null && !checkIfFloatZero(currentPrice3)) {
          let sellQuantity3 = sellPrice2;
          finalPrice = parseFloat((sellQuantity3 * currentPrice3).toFixed(3));
          scripPrices = {
            [scrip1]: currentPrice1,
            [scrip2]: currentPrice2,
            [scrip3]: currentPrice3,
          };
        }
      }
    }
    console.log(finalPrice, "----", scripPrices);
    console.log("sell close");
  } catch (error) {
    console.error("Error occurred:", error);
  }

  return { finalPrice, scripPrices };
}

async function performTriangularArbitrage(
  scrip1,
  scrip2,
  scrip3,
  arbitrageType,
  initialInvestment,
  transactionBrokerage,
  minProfit
) {
  let finalPrice = 0.0;
  let scripPrices = {};
  try {
    if (arbitrageType === "BUY_BUY_SELL") {
      const res = await checkBuyBuySell(
        scrip1,
        scrip2,
        scrip3,
        initialInvestment
      );
      finalPrice = res.finalPrice;
      scripPrices = res.scripPrices;
    } else if (arbitrageType === "BUY_SELL_SELL") {
      const res = await checkBuySellSell(
        scrip1,
        scrip2,
        scrip3,
        initialInvestment
      );
      finalPrice = res.finalPrice;
      scripPrices = res.scripPrices;
    }
    console.log("checking!!!!");
    const profitLoss = checkProfitLoss(
      finalPrice,
      initialInvestment,
      transactionBrokerage,
      minProfit
    );

    if (profitLoss > 0) {
      console.log(
        `PROFIT-${DateTime.now().toFormat("HH:mm:ss")}: ` +
          `${arbitrageType}, ${scrip1},${scrip2},${scrip3}, ` +
          `Profit/Loss: ${parseFloat(
            (finalPrice - initialInvestment).toFixed(3)
          )}`
      );

      const date = currentDate;
      const dataToSave = new ProfitLossData({
        profitLoss,
        date,
        arbitrageType,
        scrip1,
        scrip2,
        scrip3,
      });
      const savedData = await dataToSave.save();
      return savedData;
    }
  } catch (error) {
    console.error("Error performing triangular arbitrage:", error);
  }
}

module.exports = {
  sleep,
  performTriangularArbitrage,
};
