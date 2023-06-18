"use strict";
const { Model, UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Order, {
        foreignKey: "order_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      order_id: DataTypes.DATE,
      payment: DataTypes.STRING,
    },
    {
      hooks: {
        afterCreate: async (transaction, option) => {
          console.log("User afterCreate", sequelize?.models);
          try {
            await sequelize.models.AuditLogs.create({
              tableName: "Transactions",
              task: "insert",
              desc: `Process insert data ${JSON.stringify(
                transaction.toJSON()
              )}`,
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
      modelName: "Transaction",
    }
  );
  return Transaction;
};
