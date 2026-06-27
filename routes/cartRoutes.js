const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {addToCart, updateCartQuantity, removeItemFromCart} = require('../controllers/cartController');



    router.post("/:productId",auth, addToCart)
    router.put("/:productId",auth, updateCartQuantity)
    router.delete("/:productId",auth, removeItemFromCart);


module.exports = router;