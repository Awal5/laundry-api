const Order = require("../models").Order;
const User = require("../models").User;

module.exports = {
  async getOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: ["users"],
      });
      if (orders.length === 0)
        return res
          .status(404)
          .send({ status_response: "Error", message: "Order is Empty" });

      res.status(200).send({
        status_response: "Orders Retrived",
        error: null,
        data: orders,
      });
    } catch (error) {
      res.status(500).send({
        status_response: "Internal Server Error",
        error: error.message,
      });
    }
  },

  async getOrderById(req, res) {
    const { id } = req.params;
    try {
      const order = await Order.findOne({
        where: { id: id },
        include: ["users"],
      });
      if (!order)
        return res.status(404).send({
          status_response: "Error",
          message: `Order id ${id} Not Found`,
          error: "Not Found",
        });

      res
        .status(404)
        .send({ status_response: "Order Retrieved", error: null, data: order });
    } catch (error) {
      res.status(500).send({
        status_response: "Internal Server Error",
        error: error.message,
      });
    }
  },

  async getOrderCustomerId(req, res) {
    const user_id = req.userId;
    try {
      const orders = await Order.findAll({
        where: { user_id: user_id },
        include: ["users"],
      });
      if (orders.length === 0)
        return res.status(404).send({
          status_response: "Error",
          error: "Not Found",
          message: `User with id ${user_id} Not Ordered`,
        });

      res.status(200).send({
        status_response: `Customer Order with id ${user_id} Retrieved`,
        error: null,
        data: orders,
      });
    } catch (error) {
      res.status(500).send({
        status_response: "Internal Server Error",
        error: error.message,
      });
    }
  },

  async createOrder(req, res) {
    const pricePerKg = 7000;
    const weight = req.body.weight;
    const price = pricePerKg * weight;
    const status = "Process";
    const user_id = req.userId;

    try {
      const order = await Order.create({
        id: new Date(),
        weight,
        price: pricePerKg,
        total_cost: price,
        status,
        user_id: user_id,
      });

      res.status(201).send({
        status_response: "Created",
        error: null,
        data: order,
      });
    } catch (error) {
      res.status(500).send({
        status_response: "Internal Server Error",
        error: error.message,
        data: [],
      });
    }
  },

  async updateOrder(req, res) {
    const { id } = req.params;
    const pricePerKg = 7000;
    const weight = req.body.weight;
    const total_cost = pricePerKg * weight;

    try {
      const order = await Order.findOne({
        where: { id: id },
        include: ["users"],
      });

      if (!order) {
        return res.status(404).send({
          status_response: "Error",
          error: "Not Found",
          message: `Order id ${id} Not Found`,
        });
      }

      await order.update({
        weight: weight || order.weight,
        total_cost: total_cost || order.total_cost,
      });

      res
        .status(200)
        .send({ status_response: "Updated", error: null, data: order });
    } catch (error) {
      res.status(500).send({
        status_response: "Internal Server Error",
        error: error.message,
        data: [],
      });
    }
  },

  async updateOrderStatus(req, res) {
    const { id } = req.params;
    const status = req.body.status;
    try {
      const order = await Order.findOne({ where: { id } });
      if (!order) {
        return res.status(404).send({
          status_response: "Error",
          error: "Not Found",
          message: `Order id ${id} Not Found`,
        });
      }
      await order.update({ status: status || order.status });
      res
        .status(200)
        .send({ status_response: "Updated", error: null, data: order });
    } catch (error) {
      res.status(500).send({
        status_response: "Internal Server Error",
        error: error.message,
        data: [],
      });
    }
  },

  async deleteOrder(req, res) {
    const { id } = req.params;
    try {
      const order = Order.findOne({ where: { id: id } });
      if (!order) {
        return res.status(404).send({
          status_response: "Error",
          error: "Not Found",
          message: `Order id ${id} Not Found`,
        });
      }
      await Order.destroy({ where: { id: id } });
      res
        .status(200)
        .send({
          status_response: "Deleted",
          error: null,
          message: "Order Successfully Deleted",
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
