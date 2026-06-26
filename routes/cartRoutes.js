const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {addToCart, updateCartQuantity, removeItemFromCart} = require('../controllers/cartController');


router.route("/")
    .post(auth, addToCart)
    .put(auth, updateCartQuantity)
    .delete(auth, removeItemFromCart);


module.exports = router;