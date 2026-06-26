const Cart = require('../models/cartmodel');
const Product = require('../models/productmodel');
const catchAsync = require('../utils/catchAsync');
const calculateCampaignDiscount = require('../utils/compaignHelper');


const addToCart = catchAsync(async(req, res, next) => {
    const userId = req.userId;
    const {productId, quantity, category} = req.body;

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
    
    let itemFound = false;
    for(let i = 0; i < cart.items.length; i++){
        if(cart.items[i].productId.toString()===productId){
            cart.items[i].quantity+= quantity;
            itemFound = true;
            break;
        }
    }

    if(!itemFound){
        cart.items.push({
            productId,
            quantity,
            category : product.category,
            priceAtaddition : product.price    
        });
    }

    let calculatedSubTotal = 0;
    for(let i = 0; i < cart.items.length; i++){
        let currentItem = cart.items[i];
        let itemTotal = currentItem.quantity * currentItem.priceAtaddition;
        calculatedSubTotal += itemTotal;
    }

    const {discountAmount, campaignName} = calculateCampaignDiscount(cart.items, calculatedSubTotal);
    
    cart.subTotal = calculatedSubTotal;
    cart.discountAmount = discountAmount;
    cart.grandTotal = calculatedSubTotal - cart.discountAmount;
    cart.appliedCampaign = campaignName;

    await cart.save();
    res.status(200).json({
        status : 'success',
        message : 'Item added to cart successfully..',
        data : cart
    })
});


const updateCartQuantity = catchAsync(async(req, res, next) => {
    const userId = req.userId;
    const {productId, quantity} = req.body;

    if(!productId || !quantity || quantity < 1){
        return res.status(400).json({
            status : 'fail',
            message : 'Bad request'
        })
    }

    let cart = await Cart.findOne({userId});
    
    if(!cart){
        return res.status(404).json({
            status : 'fail',
            message : 'Cart not found for this user!..'
        });
    }
    let itemFound = false;
    for(let i = 0; i < cart.items.length; i++){
        if(cart.items[i].productId.toString() === productId){
            cart.items[i].quantity = quantity;
            itemFound = true;
            break;
        }
    }
    if(!itemFound){
        return res.status(404).json({
            status : 'fail',
            message : 'Product not found in your cart!'
        })
    }

    let calculatedSubTotal = 0;
    for(let i = 0; i < cart.items.length; i++){
        calculatedSubTotal += cart.items[i].quantity * cart.items[i].priceAtaddition;

    }

    const {discountAmount, campaignName} = calculateCampaignDiscount(cart.items, calculatedSubTotal);


    cart.subTotal = calculatedSubTotal;
    cart.discountAmount = discountAmount;
    cart.grandTotal = calculatedSubTotal - cart.discountAmount;
    cart.appliedCampaign = campaignName;

    await cart.save();
    return res.status(200).json({
        status : 'success',
        message : 'Cart quantity updated successfully..',
        data : cart
    });

});


const removeItemFromCart = catchAsync(async(req, res, next) =>{
    const userId = req.userId;
    const {productId} = req.body;

    if(!productId){
        return res.status(401).json({
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
    let originalLength = cart.items.length;
    cart.items = cart.items.filter((item)=>(item.productId.toString() !== productId));

    if(cart.items.length === originalLength){
        return res.status(404).json({
            status : 'fail',
            message : 'Product not found in your cart'
        });
    }
    let calculatedSubTotal = 0;
    for(let i = 0; i < cart.items.length; i++){
        calculatedSubTotal += cart.items[i].quantity * cart.items[i].priceAtaddition;
    }

    const {discountAmount, campaignName} = calculateCampaignDiscount(cart.items, cart.subTotal);

    cart.subTotal = calculatedSubTotal;
    cart.discountAmount = discountAmount;
    cart.grandTotal = cart.subTotal - cart.discountAmount;
    cart.appliedCampaign = campaignName;

    await cart.save();
    return res.status(200).json({
        status : 'success',
        message : 'Item removed from cart successfully',
        data : cart
    });
});

module.exports = {addToCart, updateCartQuantity, removeItemFromCart};