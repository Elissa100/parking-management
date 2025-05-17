const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numberPlate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entryTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  exitTime: {
    type: DataTypes.DATE
  },
  fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Vehicle.belongsTo(User, { foreignKey: 'userId', as: 'User' });

module.exports = Vehicle;