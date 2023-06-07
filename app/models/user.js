"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Role, {
        through: "user_roles",

        foreignKey: "user_id",
        otherKey: "role_id",
        onDelete: "CASCADE",
        onUpdate: "RESTRICT",
      });
    }
  }
  User.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
