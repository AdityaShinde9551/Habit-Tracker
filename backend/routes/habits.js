const express = require('express');
const router = express.Router();
const Habit = require('../models/habit');
const auth = require('../middleware/auth');

// Get all habits
router.get('/', auth, async (req, res) => {
  const habits = await Habit.find({ user: req.user.id });
  res.json(habits);
});

// Create habit
router.post('/', auth, async (req, res) => {
  try {
    const habit = await Habit.create({ ...req.body, user: req.user.id });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update habit
router.put('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete habit
router.delete('/:id', auth, async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
