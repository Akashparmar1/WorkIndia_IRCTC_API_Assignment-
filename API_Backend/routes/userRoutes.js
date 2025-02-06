const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers');
const authMiddleware = require('../middleware/authMiddleware');
const userAuthenticate = require('../middleware/userAuthenticate');

router.get('/availability', userController.getSeatAvailability);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/book',  userAuthenticate, userController.bookSeat);
router.get('/getAllbookings', userAuthenticate, userController.getBookingDetails);
module.exports = router;
