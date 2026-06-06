'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    static associate(models) {}
  }

  User.init(
    {
      fullName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};