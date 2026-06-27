
const validateStock = async(totalStock, quantity) => {
    
    if(quantity > totalStock){
        const error = new Error('Insufficient stocks');
        error.statusCode = 400;
        throw error;
        }
        
        return true;
    }



module.exports = validateStock;



