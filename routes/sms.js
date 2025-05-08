const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.post('/send-pin', smsController.sendVerificationPin);
router.post('/verify-pin', smsController.verifyPin);

module.exports = router;