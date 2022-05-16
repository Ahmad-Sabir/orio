const express = require("express");
const router = express.Router();
const buyAndSellController = require('../controllers/buyAndSellController');

router.get('/confirm_buy_transaction_last_month', buyAndSellController.buyLastMonth);
router.get('/confirm_sell_transaction_last_month', buyAndSellController.sellLastMonth);

module.exports = router; 