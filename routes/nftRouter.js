const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');
const nftTranscation = require('../controllers/nftTransController');
const upload = require('../utilities/multer');
const ipfs = require('../middleswares/ipfsMiddle');
const { nftOwnerCheck, nftOnSellCheck } = require('../middleswares/nftMiddleware');
const { authenticate } = require('../middleswares/auth');

router.get('/getTransactions', nftTranscation.getAll);
router.get('/getTransaction/:id', nftTranscation.getOne);
//router.get('/schedule', nftController.bidNft);
router.use(authenticate);
router.post('/', upload.single('file'), ipfs, nftController.createOne);
router.get('/', nftController.getAll);
router.get('/getMine', nftController.getMine);
router.get('/:id', nftController.getOne);
router.patch('/set-to-unsell/:id', nftOwnerCheck, nftController.unsell);
router.patch('/:id', nftOwnerCheck, nftOnSellCheck, nftController.updateOne);
router.delete('/:id', nftOwnerCheck, nftController.deleteOne);
router.patch('/sell/:id', nftOwnerCheck, nftOnSellCheck, nftController.sellNft);
router.post('/placeBid/:id', nftController.placeBid);
router.post('/buyNft/:id', nftController.buyNft);
router.get('/transactions/mine', nftTranscation.getMine);

// router.post('/witness', nftController.witness);
// router.post('/info', nftController.info);
module.exports = router;
