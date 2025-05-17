const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authenticate = require('../middleware/auth');
const roleCheck = require('../middleware/role');
const Vehicle = require('../models/Vehicle');

router.get('/', authenticate, async (req, res) => {
  try {
    let vehicles;
    if (req.user.role === 'admin' || req.user.role === 'staff') {
      vehicles = await Vehicle.findAll({ include: ['User'] });
    } else {
      vehicles = await Vehicle.findAll({ where: { userId: req.user.id } });
    }
    res.json(vehicles);
  } catch (error) {
    console.error('Error in GET /vehicles:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle || (req.user.role !== 'admin' && req.user.role !== 'staff' && vehicle.userId !== req.user.id)) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Error in GET /vehicles/:id:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.post('/', authenticate, roleCheck(['user']), [
  body('numberPlate').notEmpty(),
  body('type').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const vehicle = await Vehicle.create({
      numberPlate: req.body.numberPlate,
      type: req.body.type,
      userId: req.user.id
    });
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error in POST /vehicles:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.put('/:id/checkout', authenticate, roleCheck(['user']), async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle || vehicle.userId !== req.user.id) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    if (vehicle.exitTime) {
      return res.status(400).json({ error: 'Vehicle already checked out' });
    }
    const exitTime = new Date();
    const hours = Math.ceil((exitTime - vehicle.entryTime) / (1000 * 60 * 60));
    const fee = hours * 5; // $5 per hour
    await vehicle.update({
      exitTime,
      fee
    });
    res.json(vehicle);
  } catch (error) {
    console.error('Error in PUT /vehicles/:id/checkout:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;