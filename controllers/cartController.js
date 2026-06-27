const Cart = require('../models/cartmodel');
const Product = require('../models/productmodel');
const catchAsync = require('../utils/catchAsync');
const calculateCampaignDiscount = require('../utils/compaignHelper');
const validateStock = require('../utils/inventoryHelper');
const filterExpiredItems = require('../utils/itemExpiryHelper');

const addToCart = catchAsync(async(req, res, next) => {
    const userId = req.userId;
    const {productId} = req.params;
    const {quantity} = req.body;

    if(!productId || !quantity || quantity < 1){
       return res.status(400).json({
            status : 'fail',
            message : "Bad request"
        });
    }

     const product = await Product.findById(productId);
    if(!product){
        return res.status(404).json({
            status : 'fail',
            message : 'Product not found!'
        })
    }

 

    let cart = await Cart.findOne({userId});

    if(!cart){
        cart = new Cart({
            userId,
            items : [],
            subTotal : 0,
            grandTotal : 0
        });
    }
    cart.items = await filterExpiredItems(cart.items);
    
    let itemFound = false;
for (let i = 0; i < cart.items.length; i++) {

    if (cart.items[i].productId.toString() === productId) {
        const newQuantity = cart.items[i].quantity + quantity;
        await validateStock(product.inventory, newQuantity);
        cart.items[i].quantity = newQuantity;
        itemFound = true;
        break;
    }
}

if (!itemFound) {

    await validateStock(product.inventory, quantity);

    cart.items.push({
        productId,
        quantity,
        category: product.category,
        priceAtaddition: product.price
    });
}

    cart = await calculateCampaignDiscount(cart);


    await cart.save();
    res.status(200).json({
        status : 'success',
        message : 'Item added to cart successfully..',
        data : cart
    })
});


const updateCartQuantity = catchAsync(async(req, res, next) => {
    const userId = req.userId;
    const {productId} = req.params;
    const {quantity} = req.body;
    

    if(!productId || !quantity || quantity < 1){
        return res.status(400).json({
            status : 'fail',
            message : 'Bad request'
        })
    }

   

    let cart = await Cart.findOne({userId});

    cart.items = await filterExpiredItems(cart.items);

    if(!cart){
        return res.status(404).json({
            status : 'fail',
            message : 'Cart not found for this user!..'
        });
    }

     let product = await Product.findById(productId);

    if(!product){
        return res.status(404).json({
            status : 'fail',
            message : 'product not found'
        })
    }

    let itemFound = false;

for (let i = 0; i < cart.items.length; i++) {

    if (cart.items[i].productId.toString() === productId) {
        await validateStock(product.inventory, quantity);
        cart.items[i].quantity = quantity;
        itemFound = true;
        break;
    }
}

if (!itemFound) {

    return res.status(404).json({
        status: "fail",
        message: "Product not found in cart"
    });

}    
    cart = await calculateCampaignDiscount(cart);

    await cart.save();
    return res.status(200).json({
        status : 'success',
        message : 'Cart quantity updated successfully..',
        data : cart
    });

});


const removeItemFromCart = catchAsync(async(req, res, next) =>{
    const userId = req.userId;
    const {productId} = req.params;

    if(!productId){
        return res.status(400).json({
            status : 'fail',
            message : 'Invalid input'
        })
    }

    let cart = await Cart.findOne({userId});
    if(!cart){
        return res.status(404).json({
            status : 'fail',
            message : 'Cart is not found for this user'
        });
    }

    cart.items = await filterExpiredItems(cart.items);

    let originalLength = cart.items.length;
    cart.items = cart.items.filter((item)=>(item.productId.toString() !== productId));

    if(cart.items.length === originalLength){
        return res.status(404).json({
            status : 'fail',
            message : 'Product not found in your cart'
        });
    }
 

    cart = await calculateCampaignDiscount(cart);


    await cart.save();
    return res.status(200).json({
        status : 'success',
        message : 'Item removed from cart successfully',
        data : cart
    });
});

module.exports = {addToCart, updateCartQuantity, removeItemFromCart};