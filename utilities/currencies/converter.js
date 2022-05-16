const axios = require('axios');
const convert = async (from, to) => {
    let data = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`
    );
    return data;
};

module.exports={convert}
