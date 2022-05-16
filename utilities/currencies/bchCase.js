const axios = require("axios");

module.exports = bchTransactionRecord = async (txId) => {
    try{
      let { data } = await axios.get(`${process.env.TX_BCH}/${txId}`);
      if(!data){
        throw new Error("Invalid ID, Data not found");
      }

      let partialResp = Object.values(JSON.parse(JSON.stringify(data)));
      let fullResp = Object.values(JSON.parse(JSON.stringify(partialResp[0])));
      let total = fullResp[0].transaction.input_total;
      let feesInBch = fullResp[0].transaction.fee_usd;
      let amount = fullResp[0].transaction.output_total;
      let amountActual = fullResp[0].transaction.output_total_usd;

      // BCH TO USD
      let { data : allCurrencies } = await axios.get(process.env.BCH_TO_USD);
      let bchUsd = allCurrencies.data.BCH.price
      let unit = 100000000;
      amount = amount / unit;
      total = total / unit;

      // Getting USD from BCH
      amountActual = amount * bchUsd;
      let orioFee =  amountActual * 0.0015;
      orioFee = Number(orioFee).toFixed(8);
      let orioAmount = amountActual - orioFee;
      orioAmount = orioAmount.toFixed(4);
      feeInUsd = Number(feesInBch) + Number(bchUsd);
      let totalFee = Number(feesInBch) + Number(orioFee);
      currencyInUsd = bchUsd * amount;
      return {
        feesInBch,
        total,
        amount,
        orioFee,
        orioAmount,
        totalFee,
        currencyInUsd,
        txFeeInUsd: feeInUsd,
      }
    }catch(e){
      return {
        message: e.message
      }
    }
}