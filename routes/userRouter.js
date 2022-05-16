const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ipfsVerificationMiddleware } = require('../middleswares/ipfsMiddleware');
const { authenticate } = require('../middleswares/auth');

router.get('/admin_public_key', userController.adminPublicKey);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/currentUser', authenticate, userController.currentUser);
router.post('/update_address', userController.updateAddress);
router.post('/user_info', ipfsVerificationMiddleware, userController.userInfo); // Login API
router.post('/country_info', userController.countryInfo);

// router.post('/create-wyre-wallet', userController.createWyreWallet);
// router.post('/transfer-wyre', userController.transfersWyre);
// router.post('/confirm-transfers-wyre', userController.confirmTransfersWyre);
// router.post('/create-transfer', userController.createTransfer);

module.exports = router;
