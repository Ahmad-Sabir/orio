const axios = require("axios");

module.exports = ethTransactionRecord = async(txId) => {
    try{
      let { data } = await axios.get(`${process.env.TX_ETH}/${txId}`);
      if(!data){
          throw new Error("Invalid ID, Data not found");
      }

      let { total, fees } = data;
      let wei = 1000000000000000000;
      let feesInEth = fees / wei;
      let amount = total / wei;
      total =  Number(feesInEth) + Number(amount);
      let ethrResp = await axios.get(process.env.ETH_TO_USD);
      ethToUsd = ethrResp.data.result.ethusd
      amountActual = amount * ethToUsd;
      let orioFee =  amountActual * 0.01;
      orioFee = Number(orioFee).toFixed(8);
      let orioAmount = Number(amountActual) - (orioFee);
      orioAmount = orioAmount.toFixed(4);
      feesInUsd = feesInEth * ethToUsd
      let totalFee = Number(feesInEth) + Number(orioFee);
      let currencyInUsd;
      if(amount === 0){
        currencyInUsd = Number(ethToUsd) * 1;
      }else{
        currencyInUsd = Number(ethToUsd) * Number(amount);
      }
        return {
            feesInEth,
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