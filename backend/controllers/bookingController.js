const Booking = require('../models/Booking');

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const {
      cylinderType,
      cylinderName,
      quantity,
      pricePerUnit,
      deliveryDate,
      address
    } = req.body;

    const totalAmount = quantity * pricePerUnit;

    const booking = new Booking({
      userId: req.user.userId,
      cylinderType,
      cylinderName,
      quantity,
      pricePerUnit,
      totalAmount,
      deliveryDate,
      address
    });

    await booking.save();

    res.status(201).json({
      message: '✅ Booking created successfully!',
      booking
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET USER BOOKINGS
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ bookings });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL BOOKINGS (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name orgName email')
      .sort({ createdAt: -1 });

    res.json({ bookings });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE BOOKING STATUS (admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found!' });
    }

    res.json({
      message: '✅ Booking status updated!',
      booking
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};