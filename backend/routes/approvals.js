const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const authenticate = require('../middleware/auth');
const roleCheck = require('../middleware/role');
const Vehicle = require('../models/Vehicle');
const Approval = require('../models/Approval');

router.get('/', authenticate, roleCheck(['staff', 'admin']), async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: {
        exitTime: { [Op.ne]: null },
        isPaid: false
      },
      include: [{ model: require('../models/User'), as: 'User', attributes: ['email'] }]
    });
    res.json(vehicles);
  } catch (error) {
    console.error('Error in GET /approvals:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.post('/:vehicleId/approve', authenticate, roleCheck(['staff', 'admin']), async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    if (vehicle.isPaid) {
      return res.status(400).json({ error: 'Payment already approved' });
    }
    await vehicle.update({ isPaid: true });
    await Approval.create({
      vehicleId: vehicle.id,
      staffId: req.user.id,
      notes: req.body.notes || 'Approved'
    });
    res.json({ message: 'Payment approved' });
  } catch (error) {
    console.error('Error in POST /approvals/:vehicleId/approve:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;