const OrioPrices = require('../models/OrioPrices');
const Balance = require('../models/Balance');

module.exports = priceFormula = async (Tf, orio) => {
    const totalBalance = await Balance.find({});
    let totalBalances = 0;

    for (let i = 0; i < totalBalance.length; i++) {
        const { balance } = totalBalance[i];
        totalBalances += Number(balance);
    }

    let Ts = totalBalances; // Get All The
    let Qi;

    // Get Query to get data from the database.
    let response = await OrioPrices.findOne().sort({ createdAt: -1 });
    if (response && response.orioCalculatedPrice) {
        Qi = response.orioCalculatedPrice;
    } else {
        Qi = 1;
    }
    let orioPrice = Number(Qi) + (0.2 * Number(Tf)) / Number(Ts);
    orioPrice = orioPrice.toFixed(10);
    // Store data into the OrioPrices
    console.log(orioPrice);
    await OrioPrices.create({
        orioPrice: Qi,
        numberOfOrio: orio,
        orioCalculatedPrice: orioPrice,
    });
    return Qi;
};

////////////////////////////////////////////////////////
// const Qi = 2; // Genesis
// const Ts = 4; // Total Coins Supplies
// module.exports = priceFormula = (Qi, Ts, Tf, n) => {
//   if (n === 0) {
//     return Qi;
//   } else {
//     n = n - 1;
//     return priceFormula(Tf, n) + (0.2 * Tf) / Ts;
//   }
// };
/////////////////////////////////////////////////////////
