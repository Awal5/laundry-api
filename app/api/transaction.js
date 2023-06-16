const Order = require("../models").Order;
const User = require("../models").User;
const Transaction = require("../models").Transaction;

module.exports = {
  async getTranscations(req, res) {
    try {
      const transactions = await Transaction.findAll({
        include: [
          {
            model: Order,
            attributes: ["id", "weight", "total_cost", "status"],
            include: ["users"],
          },
        ],
      });

      if (transactions.length === 0) {
        return res.status(404).send({
          status_response: "Error",
          Error: "Empty",
          message: "Transactions is Empty",
        });
      }

      res.status(200).send({
        status_response: "Retrived",
        error: null,
        message: "All Transactions Retrived",
        data: transactions,
      });
    } catch (error) {
      res.status(500).send({
        status_response: "Internal Server Error",
        error: error.message,
      });
    }
  },

  async getOneTranscation(req, res) {
    const { id } = req.params;
    try {
      const transaction = await Transaction.findOne({
        where: { id: id },
        include: [
          {
            model: Order,
            attributes: ["id", "weight", "total_cost", "status"],
            include: ["users"],
          },
        ],
      });

      if (!transaction) {
        return res.status(404).send({
          status_response: "Error",
          error: "Empty",
          message: `Transaction with id ${id} Not Found`,
        });
      }

      res.status(200).send({
        status_response: "Retrived",
        error: null,
        message: `Transaction with id ${id}  Retrived`,
        data: transaction,
      });
    } catch (error) {
      res.status(500).send({
        status_response: "Internal Server Error",
        error: error.message,
      });
    }
  },

  async createTransaction(req, res) {
    const order_id = req.body.order_id;
    const payment = req.body.payment;
    try {
      const order = await Order.findOne({ where: { id: order_id } });
      if (!order) {
        return res.status(404).send({
          status_response: "Error",
          message: `Order id ${order_id} Not Found`,
          error: "Not Found",
        });
      }

      const transaction = await Transaction.create({ order_id, payment });
      await order.update({ status: "Lunas" });

      res.status(201).send({
        status_response: "Created",
        error: null,
        message: "Transaction Successfully Created",
        data: transaction,
      });
    } catch (error) {
      res.status(500).send({
        status_response: "Internal Server Error",
        error: error.message,
        data: [],
      });
    }
  },

  async updateTransaction(req, res) {
    const { id } = req.params;
    const order_id = req.body.order_id;
    const payment = req.body.payment;
    try {
      const transaction = await Transaction.findOne({
        where: { id: id },
      });

      if (!transaction) {
        return res.status(404).send({
          status_response: "Error",
          error: "Empty",
          message: `Transaction with id ${id} Not Found`,
        });
      }

      await transaction.update({
        order_id: order_id || transaction.order_id,
        payment: payment || transaction.payment,
      });

      const result = await Transaction.findOne({
        where: { id: id },
        include: [
          {
            model: Order,
            attributes: ["id", "weight", "total_cost", "status"],
            include: ["users"],
          },
        ],
      });

      res.status(200).send({
        status_response: "Updated",
        error: null,
        message: `Transaction with id ${id} Successfully Updated`,
        data: result,
      });
    } catch (error) {
      res.status(500).send({
        status_response: "Internal Server Error",
        error: error.message,
        data: [],
      });
    }
  },

  async deleteTransaction(req, res) {
    const { id } = req.params;
    try {
      const transaction = await Transaction.findOne({
        where: { id: id },
      });

      if (!transaction) {
        return res.status(404).send({
          status_response: "Error",
          error: "Empty",
          message: `Transaction with id ${id} Not Found`,
        });
      }

      await Transaction.destroy({ where: { id: id } });

      res.status(200).send({
        status_response: "Deleted",
        error: null,
        message: `Transaction with id ${id} Successfully Deleted`,
        data: [],
      });
    } catch (error) {
      res.status(500).send({
        status_response: "Internal Server Error",
        error: error.message,
        data: [],
      });
    }
  },
};
