const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const ApiError = require("../utils/apiErrors");
const factory = require("./handlerFactory");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// @desc    create cash order
// @route   POST  /api/v1/orders/cartId
// @access  protected/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //app settings

  const taxPrice = 0;
  const shippingPrice = 0;

  //1) get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("no such cart with this id", 404));
  }
  //2) get order price depend on cart price & check if coupon applied
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  //3) create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body,
    totalOrderPrice,
  });
  //4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    //5) clear user cart
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ status: "success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

// @desc    get all orders
// @route   GET  /api/v1/orders
// @access  protected/user or admin
exports.getAllOrders = factory.getAll(Order);

// @desc    get specific order
// @route   GET  /api/v1/orders/:id
// @access  protected/user or admin

exports.getSpecificOrder = factory.getOne(Order);

// @desc    update order paid status
// @route   PUT  /api/v1/orders/:id/paid
// @access  protected/manger or admin

exports.updateOrderPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("no such order with this Id", 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    update order derived status
// @route   PUT  /api/v1/orders/:id/derive
// @access  protected/manger or admin

exports.updateOrderDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("no such order with this id", 404));
  }

  order.deliveredAt = Date.now();
  order.isDelivered = true;

  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

//  online payment

//  @desc     Get checkout session from stripe and send it as response to client side
//  @route    GET  /api/v1/orders/checkout-session/:cartId
//  @access   Protected/User

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  //  app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("no such cart with this id", 404));
  }
  // 2) Get order price depend on cart price & check id coupon applied
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) create stripe checkout session

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          unit_amount: totalOrderPrice * 100,
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send session to response

  res.status(200).json({ status: "success", session });
});
