const verifySignUpController = require("../api").verifySignUp;
const verifySignController = require("../api").verifySign;
const verifyJwtTokenController = require("../api").verifyJwtToken;
const orderController = require("../api").order;

module.exports = function (app) {
  app.post(
    "/api/auth/signup",
    [
      verifySignUpController.checkDuplicateUserNameOrEmail,
      verifySignUpController.checkRolesExisted,
    ],
    verifySignController.signup
  );

  app.post("/api/auth/signin", verifySignController.signin);

  app.get(
    "/orders",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
    orderController.getOrders
  );

  app.get(
    "/order/:id",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
    orderController.getOrderById
  );

  app.get(
    "/customer/order/:id",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isUser],
    orderController.getOrderCustomerId
  );

  app.post(
    "/customer/order",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isUser],
    orderController.createOrder
  );

  app.put(
    "/customer/order/:id",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isUser],
    orderController.updateOrder
  );

  app.put(
    "/order/:id",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
    orderController.updateOrderStatus
  );

  app.delete(
    "/order/:id",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
    orderController.deleteOrder
  );
};
