const express = require("express");
const ccxt = require("ccxt");
const { DateTime } = require("luxon");
const math = require("mathjs");

const app = express();
const port = 3000;

const INVESTMENT_AMOUNT_DOLLARS = 100;
const MIN_PROFIT_DOLLARS = 0.5;
const BROKERAGE_PER_TRANSACTION_PERCENT = 0.2;
// const apiKey = "YOUR_API_KEY";
// const secret = "YOUR_SECRET";
const exchange = new ccxt.bybit();

function getCryptoCombinations(marketSymbols, base) {
  const combinations = [];
  for (const sym1 of marketSymbols) {
    const sym1Token1 = sym1.split("/")[0];
    const sym1Token2 = sym1.split("/")[1];
    if (sym1Token2 === base) {
      for (const sym2 of marketSymbols) {
        const sym2Token1 = sym2.split("/")[0];
        const sym2Token2 = sym2.split("/")[1];
        if (sym1Token1 === sym2Token2) {
          for (const sym3 of marketSymbols) {
            const sym3Token1 = sym3.split("/")[0];
            const sym3Token2 = sym3.split("/")[1];
            if (sym2Token1 === sym3Token1 && sym3Token2 === sym1Token2) {
              const combination = {
                base: sym1Token2,
                intermediate: sym1Token1,
                ticker: sym2Token1,
              };
              combinations.push(combination);
            }
          }
        }
      }
    }
  }
  return combinations;
}

async function fetchCurrentTickerPrice(ticker) {
  try {
    const currentTickerDetails = await exchange.fetchTicker(ticker);
    const tickerPrice = currentTickerDetails
      ? currentTickerDetails.close
      : null;
    return tickerPrice;
  } catch (error) {
    console.error("Error fetching ticker price:", error);
    return null;
  }
}

function checkIfFloatZero(value) {
  return math.isClose(value, 0.0, 1e-3);
}

async function checkBuyBuySell(scrip1, scrip2, scrip3, initialInvestment) {
  let finalPrice = 0;
  let scripPrices = {};

  try {
    // SCRIP1
    let investmentAmount1 = initialInvestment;
    let currentPrice1 = await fetchCurrentTickerPrice(scrip1);

    if (currentPrice1 !== null && !checkIfFloatZero(currentPrice1)) {
      let buyQuantity1 = parseFloat(
        (investmentAmount1 / currentPrice1).toFixed(8)
      );
      await sleep(1000);

      // SCRIP2
      let investmentAmount2 = buyQuantity1;
      let currentPrice2 = await fetchCurrentTickerPrice(scrip2);

      if (currentPrice2 !== null && !checkIfFloatZero(currentPrice2)) {
        let buyQuantity2 = parseFloat(
          (investmentAmount2 / currentPrice2).toFixed(8)
        );
        await sleep(1000);

        // SCRIP3
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
  } catch (error) {
    console.error("Error occurred:", error);
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
    // SCRIP1
    let investmentAmount1 = initialInvestment;
    let currentPrice1 = await fetchCurrentTickerPrice(scrip1);

    if (currentPrice1 !== null && !checkIfFloatZero(currentPrice1)) {
      let buyQuantity1 = parseFloat(
        (investmentAmount1 / currentPrice1).toFixed(8)
      );
      await sleep(1000);

      // SCRIP2
      let investmentAmount2 = buyQuantity1;
      let currentPrice2 = await fetchCurrentTickerPrice(scrip2);

      if (currentPrice2 !== null && !checkIfFloatZero(currentPrice2)) {
        let sellQuantity2 = buyQuantity1;
        let sellPrice2 = parseFloat((sellQuantity2 * currentPrice2).toFixed(8));
        await sleep(1000);

        // SCRIP3
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
  } catch (error) {
    console.error("Error occurred:", error);
  }

  return { finalPrice, scripPrices };
}

function checkProfitLoss(
  totalPriceAfterSell,
  initialInvestment,
  transactionBrokerage,
  minProfit
) {
  const apprxBrokerage = ((transactionBrokerage * initialInvestment) / 100) * 3;
  const minProfitablePrice = initialInvestment + apprxBrokerage + minProfit;
  const profitLoss = parseFloat(
    (totalPriceAfterSell - minProfitablePrice).toFixed(3)
  );
  return profitLoss;
}

async function placeBuyOrder(scrip, quantity, limit) {
  try {
    const order = await exchange.createLimitBuyOrder(scrip, quantity, limit);
    return order;
  } catch (error) {
    console.error("Error placing buy order:", error);
    return null;
  }
}

async function placeSellOrder(scrip, quantity, limit) {
  try {
    const order = await exchange.createLimitSellOrder(scrip, quantity, limit);
    return order;
  } catch (error) {
    console.error("Error placing sell order:", error);
    return null;
  }
}

// async function placeTradeOrders(
//   type,
//   scrip1,
//   scrip2,
//   scrip3,
//   initialAmount,
//   scripPrices
// ) {
//   let finalAmount = 0.0;

//   try {
//     if (type === "BUY_BUY_SELL") {
//       const s1Quantity = initialAmount / scripPrices[scrip1];
//       await placeBuyOrder(scrip1, s1Quantity, scripPrices[scrip1]);

//       const s2Quantity = s1Quantity / scripPrices[scrip2];
//       await placeBuyOrder(scrip2, s2Quantity, scripPrices[scrip2]);

//       const s3Quantity = s2Quantity;
//       await placeSellOrder(scrip3, s3Quantity, scripPrices[scrip3]);
//     } else if (type === "BUY_SELL_SELL") {
//       const s1Quantity = initialAmount / scripPrices[scrip1];
//       await placeBuyOrder(scrip1, s1Quantity, scripPrices[scrip1]);

//       const s2Quantity = s1Quantity;
//       await placeSellOrder(scrip2, s2Quantity, scripPrices[scrip2]);

//       const s3Quantity = s2Quantity * scripPrices[scrip2];
//       await placeSellOrder(scrip3, s3Quantity, scripPrices[scrip3]);
//     }
//   } catch (error) {
//     console.error("Error placing trade orders:", error);
//   }

//   return finalAmount;
// }

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
      // Check this combination for triangular arbitrage: scrip1 - BUY, scrip2 - BUY, scrip3 - SELL
      [finalPrice, scripPrices] = await checkBuyBuySell(
        scrip1,
        scrip2,
        scrip3,
        initialInvestment
      );
    } else if (arbitrageType === "BUY_SELL_SELL") {
      // Check this combination for triangular arbitrage: scrip1 - BUY, scrip2 - SELL, scrip3 - SELL
      [finalPrice, scripPrices] = await checkBuySellSell(
        exchange,
        scrip1,
        scrip2,
        scrip3,
        initialInvestment
      );
    }

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
    }
  } catch (error) {
    console.error("Error performing triangular arbitrage:", error);
  }
}

app.get("/markets", async (req, res) => {
  try {
    const markets = await exchange.loadMarkets();
    const marketSymbols = Object.keys(markets);
    console.log(marketSymbols.length);
    const CombinationsUSDT = getCryptoCombinations(marketSymbols, "USDT");
    console.log(CombinationsUSDT.length);

    CombinationsUSDT.forEach(async (combination) => {
      const base = combination["base"];
      const intermediate = combination["intermediate"];
      const ticker = combination["ticker"];

      const s1 = `${intermediate}/${base}`; // Eg: BTC/USDT
      const s2 = `${ticker}/${intermediate}`; // Eg: ETH/BTC
      const s3 = `${ticker}/${base}`; // Eg: ETH/USDT

      // Check triangular arbitrage for buy-buy-sell
      await performTriangularArbitrage(
        s1,
        s2,
        s3,
        "BUY_BUY_SELL",
        INVESTMENT_AMOUNT_DOLLARS,
        BROKERAGE_PER_TRANSACTION_PERCENT,
        MIN_PROFIT_DOLLARS
      );
      // Sleep to avoid rate limit on api calls (RateLimitExceeded exception)
      await sleep(1000);
      // Check triangular arbitrage for buy-sell-sell
      await performTriangularArbitrage(
        s3,
        s2,
        s1,
        "BUY_SELL_SELL",
        INVESTMENT_AMOUNT_DOLLARS,
        BROKERAGE_PER_TRANSACTION_PERCENT,
        MIN_PROFIT_DOLLARS
      );
      await sleep(1000);
    });
    res.json({ marketSymbols, CombinationsUSDT });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch markets" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
