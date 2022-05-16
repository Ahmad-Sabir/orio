const axios = require("axios");
const {getBtcUsd} = require('../btc-usd');

module.exports = btcTransactionRecord = async( txId ) => {
    try{
        let { data } = await axios.get(`${process.env.TX_BTC}/${txId}`);
        if(!data){
            throw new Error("Invalid ID, Data not found");
        }
        let { total, fees } = data;
        let satoshi = 100000000; 
        let feesInBtc = fees / satoshi;
        let amount = total / satoshi;
        total = data.inputs[0].output_value;
        total = total / satoshi;
        let btcToUsd = await getBtcUsd("BTC-USD");
        btcToUsd = btcToUsd.data.amount
        amountActual = total * btcToUsd;
        let orioFee =  amountActual * 0.01;
        orioFee = Number(orioFee).toFixed(8);
        let orioAmount = Number(amountActual) - Number(orioFee);
        orioAmount = Number(orioAmount).toFixed(4);
        feesInUsd = Number(feesInBtc) * Number(btcToUsd);
        let totalFee = Number(feesInUsd) + Number(orioFee);
        currencyInUsd = btcToUsd * amount; // Error
        return {
            feesInBtc,
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