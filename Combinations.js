const ccxt = require("ccxt");
const math = require("mathjs");

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

module.exports = {
  getCryptoCombinations,
};
