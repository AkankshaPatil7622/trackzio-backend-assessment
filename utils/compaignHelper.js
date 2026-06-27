
const calculateCampaignDiscount = (cart) => {
    let bestDiscount = 0;
    let campaignName = "NONE";
    let calculatedSubTotal = 0;
    let totalItems = cart.items.length;

    // calculate subTotal
    for(let i = 0; i < totalItems; i++){
        let currentItem = cart.items[i];
        calculatedSubTotal += currentItem.quantity * currentItem.priceAtaddition;
}

    // if subTotal is > 5000 then apply 10% discount
    if(calculatedSubTotal >= 5000){
        bestDiscount = calculatedSubTotal * 10/100;
        campaignName = "MEGA_SAVER"
    }

    // category diversity bonus
    let uniqueCategories = new Set();
    for(let i = 0; i < totalItems; i++){
        let currentItem = cart.items[i];
        if(currentItem.category){
            uniqueCategories.add(currentItem.category);
        }
    }

    if(uniqueCategories.size >= 3){
        const diversityDiscount = 300;
        if(diversityDiscount > bestDiscount){
            bestDiscount = diversityDiscount;
            campaignName = 'CATEGORY_DIVERSITY_BONUS'
        }
    }

    //special bonus
    if(calculatedSubTotal >= 5000 && uniqueCategories.size >= 3){
        const specialBonus = calculatedSubTotal * 20/100;
        if(specialBonus > bestDiscount){
            bestDiscount = specialBonus;
            campaignName = 'SPECIAL_BONUS';
        }
    }

    cart.subTotal = calculatedSubTotal;
    cart.discountAmount = bestDiscount;
    cart.grandTotal = calculatedSubTotal - bestDiscount;
    cart.appliedCampaign = campaignName;
    
    return cart;
   

}




module.exports = calculateCampaignDiscount;