const express = require('express');
const router = express.Router();
const toCryptoController = require('../controllers/toCryptoController');
const { authenticate } = require('../middleswares/auth');

router.post('/transfer-wyre', authenticate, toCryptoController.transfersWyre);
router.post('/create-transfer', toCryptoController.createTransfer);
// router.post('/create-wyre-wallet', toCryptoController.createWyreWallet);
router.post('/confirm-transfers-wyre', toCryptoController.confirmTransfersWyre);
/*
    BUY MODULE
*/
router.post('/test/buy-orio', authenticate, toCryptoController.buyOrio);
router.post('/test/sell-orio', authenticate, toCryptoController.sellOrio);
router.post('/test/sell-fiat', authenticate, toCryptoController.sellWithFiat);
/*
    USER MODULE
*/
router.get('/orio-balance', toCryptoController.orioBalance);
router.get('/orio-total-balance', toCryptoController.orioTotalBalance);
router.get('/all-obyte-users', toCryptoController.allObyteUsers);
router.get('/all-obyte-users-count', toCryptoController.allObyteUsersCount);
router.get('/get-top-ten-records', toCryptoController.getTopTenRecords);
router.get('/transactions-count', toCryptoController.transactionsCount);
router.post('/get-transaction-details', toCryptoController.getTransactionDetails);
router.get('/get-all-transaction-details', toCryptoController.getAllTransactionDetails);
router.post('/pagination-of-twenty-records', toCryptoController.paginationOfTwentyRecords);
router.get('/country-data', toCryptoController.countryData);
router.post('/user-sell-buy-record',authenticate, toCryptoController.userSellAndBuyRecord);

/*
GET BALANCE FOR LAST Week and Day
*/
router.get('/orio-balance-record', toCryptoController.orioBalanceRecord);
router.get('/orio-last-thirty-records', toCryptoController.lastThirtyRecords);
router.get('/latest-orio-price', toCryptoController.latestOrioPrice);
router.get('/get-datewise-record', toCryptoController.getDateWiseRecord);
router.get('/test-price-formula', toCryptoController.testPriceFormula);

module.exports = router;
