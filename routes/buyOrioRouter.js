const express = require("express");
const router = express.Router();
const buyOrioController = require('../controllers/buyOrioController');

router.get("/currency_conversion", buyOrioController.currencyConversion);//
router.post("/orio_fee", buyOrioController.orioFee);
router.post("/verify_tex_id", buyOrioController.verifyTransaction);//
module.exports = router; 