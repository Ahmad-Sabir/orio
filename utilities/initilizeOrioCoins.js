// // This file is not included in any of the running file.
// const Coin = require('../models/Coin');
// const initializeCoins = async () => {
// try{
//     const sources = await Coin.find();
//     if(sources.length === 0){
//         await Coin.insertMany([
//             {
//                 coinsGenerated: "0",
//                 coinsBurn: "0",
//                 source: "DCP1",
//             },
//             {
//                 coinsGenerated: "0",
//                 coinsBurn: "0",
//                 source: "DCP2",
//             },
//             {
//                 coinsGenerated: "0",
//                 coinsBurn: "0",
//                 source: "DCP3",
//             },
//             {
//                 coinsGenerated: "0",
//                 coinsBurn: "0",
//                 source: "DCP4",
//             }
//         ])}    
//     }catch(e){
//         console.log("Error in coins initializing : ", e.message)
//     }
// };

// initializeCoins();