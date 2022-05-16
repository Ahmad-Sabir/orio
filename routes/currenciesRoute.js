const express = require('express');
const router = express.Router();
const upload = require('../utilities/multer');
const currencyController = require('../controllers/currencyController');

router.post('/',upload.single('icon'), currencyController.createOne);
router.get('/', currencyController.getAll);
router.get('/:id', currencyController.getOne);
router.patch('/:id', upload.single('icon'), currencyController.updateOne);
router.delete('/:id', currencyController.deleteOne);

module.exports = router;
