const express = require("express");
const ccxt = require("ccxt");
const math = require("mathjs");

function checkProfitLoss(
  totalPriceAfterSell,
  initialInvestment,
  transactionBrokerage,
  minProfit
) {
  const apprxBrokerage = ((transactionBrokerage * initialInvestment) / 100) * 3;
  console.log("brokerage", apprxBrokerage);
  const minProfitablePrice = initialInvestment + apprxBrokerage + minProfit;
  const profitLoss = parseFloat(
    (totalPriceAfterSell - minProfitablePrice).toFixed(3)
  );
  return profitLoss;
}

module.exports = {
  checkProfitLoss,
};
