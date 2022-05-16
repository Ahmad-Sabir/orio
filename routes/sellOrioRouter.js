const express = require('express');
const router = express.Router();
const sellOrioController = require('../controllers/sellOrioController');
const { authenticate } = require('../middleswares/auth');
router.post('/transaction_detail', sellOrioController.getTransactionDetail); //
router.post('/transactions_details', sellOrioController.getTransactionsDetails);
router.get('/except_ten_transactions', sellOrioController.getExceptTenTransaction); //
router.get('/first_ten_transactions', sellOrioController.getTenTransaction); //
router.use(authenticate);
router.post('/sell_request', sellOrioController.sellRequest); //
router.post('/user_balance', sellOrioController.getUserBalance); //
//router.post('/reject_request', sellOrioController.rejectRequest);
//router.get('/pending_request', sellOrioController.pendingRequest);
router.post('/verify_transaction', sellOrioController.verifyTransaction); //;
router.post('/user_notifications', sellOrioController.getUserNotifications);
router.post('/transaction_detail', sellOrioController.getTransactionDetail); //
router.post('/transactions_details', sellOrioController.getTransactionsDetails);
router.get('/except_ten_transactions', sellOrioController.getExceptTenTransaction); //
router.get('/first_ten_transactions', sellOrioController.getTenTransaction); //

module.exports = router;
