const calculateCampaignDiscount = (cartItems, subTotal) => {
    let bestDiscount = 0;
    let campaignName = "NONE";

    // if subTotal is > 5000 then apply 10% discount
    if(subTotal >= 5000){
        bestDiscount = subTotal * 10/100;
        campaignName = "MEGA_SAVER"
    }

    // category diversity bonus
    let uniqueCategories = new Set();
    for(let i = 0; i < cartItems.length; i++){
        if(cartItems[i].category){
            uniqueCategories.add(cartItems[i].category);
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
    if(subTotal >= 5000 && uniqueCategories.size >= 3){
        const specialBonus = subTotal * 20/100;
        if(specialBonus > bestDiscount){
            bestDiscount = specialBonus;
            campaignName = 'SPECIAL_BONUS';
        }
    }

    return {
        discountAmount : bestDiscount,
        campaignName
    }
   

}

module.exports = calculateCampaignDiscount;