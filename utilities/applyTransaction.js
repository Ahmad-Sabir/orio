const mongoose = require("mongoose");
const Notification = require('../models/Notification');
const Coin = require('../models/Coin');
const Balance = require('../models/Balance');
const SellAndBuyOrio = require("../models/SellAndBuyOrio");
const VerifyTransaction = require('../models/VerifyTransaction');

module.exports = applyTransaction = async (txId, orioAddress, orioAmounts) => {
    if(!(txId && orioAddress && orioAmounts)){
        return new Error("Some parameters are missing");
    }
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      //++++++++++++++++++++++++++++++
      //  COMMON SECTION IN SELL & BUY
      //++++++++++++++++++++++++++++++
      const { dcp: source, action } = await SellAndBuyOrio.findOneAndUpdate({ txId }, { status : "CONFIRM"}).session(session); 
      await VerifyTransaction.findOneAndUpdate({ txId }, {$set : {status: 'CONFIRM'}}).session(session);
      await Notification.create([{
        txId: txId,
        orioAddress: orioAddress,
        orioAmount: orioAmounts,
        status: true,
        action,
      }],  { session: session });

      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // UN-COMMON SECTION IN SELL & BUY CASES 
      // Checks are not required becase if data exist its means it's a SELL case otherwise it's BUY case
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      let responseBalance = await Balance.findOne({"_id.orioAddress": orioAddress, "_id.source": source}).session(session);
      if(responseBalance){
        let grossBalance = Number(responseBalance.balance) + Number(orioAmounts);
        await Balance.updateOne({ 
          '_id.orioAddress': responseBalance._id.orioAddress, 
          '_id.source': responseBalance._id.source  
        }, 
        { $set: 
          {
            balance : grossBalance 
          } 
        }
        ).session(session);
      }else{
        await Balance.create([{
          '_id.orioAddress': orioAddress,
          '_id.source': source,
          balance: orioAmounts,
        }], {session: session});  
      }
      const sourceExist = await Coin.findOne({ source });
      if(!sourceExist){
          await Coin.create([
            {
              coinsGenerated: sourceExist.coinsGenerated,
              coinsBurn: "0",
              source,
            }
          ],  { session: session });
      }else{
          const grossCoins = Number(sourceExist.coinsGenerated) + Number(orioAmounts);
          await Coin.findOneAndUpdate({ source }, {$set:{ coinsGenerated:  grossCoins }}).session(session); 
      }
      await session.commitTransaction();
      session.endSession();
      console.log("Transaction has been completed successfully : TxId => ", txId);
      return true;
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log("Error in Transaction : ", err.message);
        return false
    } 
}
