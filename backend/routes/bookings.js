const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus
} = require('../controllers/bookingController');

router.post('/', auth, createBooking);
router.get('/', auth, getUserBookings);
router.get('/all', auth, getAllBookings);
router.put('/:id', auth, updateBookingStatus);

module.exports = router;