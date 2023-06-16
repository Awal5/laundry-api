const verifySignUpController = require("../api").verifySignUp;
const verifySignController = require("../api").verifySign;
const verifyJwtTokenController = require("../api").verifyJwtToken;
const orderController = require("../api").order;
const transactionController = require("../api").transaction;

module.exports = function (app) {
  //auth
  app.post(
    "/api/auth/signup",
    [
      verifySignUpController.checkDuplicateUserNameOrEmail,
      verifySignUpController.checkRolesExisted,
    ],
    verifySignController.signup
  );

  app.post("/api/auth/signin", verifySignController.signin);

  //order
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

  //transaction
  app.get(
    "/transactions",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
    transactionController.getTranscations
  );

  app.get(
    "/transaction/:id",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
    transactionController.getOneTranscation
  );

  app.post(
    "/transaction",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isUser],
    transactionController.createTransaction
  );

  app.put(
    "/transaction/:id",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
    transactionController.updateTransaction
  );

  app.delete(
    "/transaction/:id",
    [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isAdmin],
    transactionController.deleteTransaction
  );
};
