
const VerifyTransaction = require('../models/VerifyTransaction');
module.exports = regularCustomer = async (user_orio_address) => {
    const response = await VerifyTransaction.find({userOrioAddress : user_orio_address});
    console.log(response.length);
    return response.length;
}