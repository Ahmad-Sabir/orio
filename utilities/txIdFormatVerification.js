module.exports = txIdFormatVerification = async (currency, txId) => {
  switch (currency) {
    case "BTC":
    case "LTC":
    case "BCH":
      var reqExp = new RegExp(/^[a-fA-F0-9]{64}$/);
      if (!reqExp.exec(txId)) {
        return true;
      }
      return false;

    case "ETH":
      var reqExp = new RegExp(/^0x([A-Fa-f0-9]{64})$/);
      if (!reqExp.exec(txId)) {
        return true;
      }
      return false;

    default:
      return true;
  }
};
