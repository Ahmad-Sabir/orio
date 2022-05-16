const axios = require("axios");

module.exports = ltcTransactionRecord = async( txId ) => {
  console.log("In Section");
    try{
      let {data} = await axios.get(`${process.env.TX_LTC}/${txId}`);
      if(!data){
          throw new Error("Invalid ID, Data not found");
      }

      let { total, fees } = data;
      let photon = 100000000;
      let feesInLtc = fees / photon;
      let amount = total / photon;
      total = total / photon;
      // total = Number(fees) + Number(amount);
      let ltcResp = await axios.get(process.env.LTC_TO_USD);
      ltcToUsd = ltcResp.data[0].price;
      amountActual = amount * ltcToUsd;
      let orioFee = amountActual * 0.01;
      orioFee = Number(orioFee).toFixed(8);
      let orioAmount = Number(amountActual) - Number(orioFee);
      orioAmount = orioAmount.toFixed(4);
      feesInUsd = feesInLtc * ltcToUsd;
      let totalFee = Number(feesInLtc) + Number(orioFee);
      currencyInUsd = ltcToUsd * amount;

      return {
        feesInLtc,
        total,
        amount,
        orioFee,
        orioAmount,
        totalFee,
        currencyInUsd,
        txFeeInUsd: feesInUsd,
      }
    }catch(e){
      return {
        message: e.message
      }
    } 
}