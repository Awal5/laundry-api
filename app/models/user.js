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

      User.hasMany(models.Order, {
        foreignKey: "user_id",
        as: "order",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      hooks: {
        afterCreate: async (user, options) => {
          try {
            await sequelize.models.auditLogs.create({
              tableName: "Users",
              task: "insert",
              desc: `Process insert data ${JSON.stringify(
                user.toJSON()
              )}`,
            });
          } catch (error) {
            console.log(error);
          }
        },
      },
      sequelize
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
