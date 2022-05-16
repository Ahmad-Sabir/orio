const VerifyTransaction = require("../models/VerifyTransaction");
const isTransactionConfirm = require('../utilities/isTransactionConfirm');
const applyTransaction = require("../utilities/applyTransaction");

module.exports = checkAllPendingRecords = async () => {
    try{
        let response = await VerifyTransaction.find({status : "PENDING"}).sort({'createdAt': -1});
        let pendingRecords = [];
        for(let i = 0; i < response.length; i++){
            let { txId , currency, userOrioAddress, burntOrioAmount } = response[i];
            pendingRecords.push({ txId , currency, userOrioAddress, burntOrioAmount });
        }
        if(pendingRecords.length === 0){
          console.log("There is no pending request");
          return 0;
        }else if(pendingRecords.length > 10){
            for(let i = 0; i < 10; i++){
                let { txId, currency, userOrioAddress, burntOrioAmount } = pendingRecords[i]
                if(await isTransactionConfirm(txId, currency)){
                    await applyTransaction(txId, userOrioAddress, burntOrioAmount);
                }else{
                    console.log(`${txId} is now pending`);
                };
            }
        }else{
            for(let i = 0; i < pendingRecords.length; i++){
                let { txId, currency, userOrioAddress, burntOrioAmount } = pendingRecords[i]
                if(await isTransactionConfirm(txId, currency)){
                    await applyTransaction(txId, userOrioAddress, burntOrioAmount);
                }else{
                    console.log(`${txId} is now pending`);
                };    
            }
        }
    }catch(e){
        if(e.response && e.response.data && e.response.data.message){
            e.message = e.response.data.message
        }
        console.log("Check all pending records = ", e.message);
        // console.log(`Bearer ${process.env.ADMIN_SECRET_KEY}`);
        // process.exit();
    }
}
