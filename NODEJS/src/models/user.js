'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here 1->n
      User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' }) //n-1
      User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' }) //n-1
      User.hasOne(models.Markdown, { foreignKey: 'doctorId' }) //1-1
      User.hasOne(models.Doctor_Info, { foreignKey: 'doctorId' }) //1-1
      User.hasMany(models.Schedule, { foreignKey: 'doctorId', as: 'doctorData' }) //1-n
      User.hasMany(models.Booking, { foreignKey: 'patientId', as: 'patientData' }) //1-n
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phonenumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
    firebaseUid: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};