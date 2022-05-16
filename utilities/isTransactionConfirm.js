const axios = require("axios");
const confirmWyreTransaction = require('./confirmWyreTransaction');

module.exports = isTransactionConfirm = async (txId, currency) => {
    switch(currency){
    case "BTC":
        var { data } = await axios.get(`${process.env.CONFIRM_BTC}/${txId}`);
    break;

    case "ETH":
        var { data } = await axios.get(`${process.env.CONFIRM_ETH}/${txId}`);
    break;

    case "LTC":
        var { data } = await axios.get(`${process.env.CONFIRM_LTC}/${txId}`);
    break;

    case "BCH":
        var { data } = await axios.get(`${process.env.CONFIRM_BCH}/${txId}`);
        data = data.details
    break;
    default:
        var data  = await confirmWyreTransaction(txId);
    }
    const { confirmations } = data;
    return confirmations; 
}