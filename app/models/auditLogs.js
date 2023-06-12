"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class auditLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  auditLogs.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tableName: DataTypes.STRING,
      task: DataTypes.STRING,
      desc: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AuditLogs",
    }
  );
  return auditLogs;
};
