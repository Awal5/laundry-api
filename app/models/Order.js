"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "users",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      Order.hasOne(models.Transaction, {
        foreignKey: "order_id",
        as: "transaction",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Order.init(
    {
      id: { type: DataTypes.DATE, allowNull: false, primaryKey: true },
      price: DataTypes.INTEGER,
      weight: DataTypes.INTEGER,
      total_cost: DataTypes.INTEGER,
      status: DataTypes.STRING,
      user_id: DataTypes.STRING,
    },
    {
      hooks: {
        afterCreate: async (order, options) => {
          try {
            await sequelize.models.AuditLogs.create({
              tableName: "Orders",
              task: "insert",
              desc: `Process insert data ${JSON.stringify(order.toJSON())}`,
            });
          } catch (error) {
            console.log(error);
          }
        },
      },
      sequelize,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
