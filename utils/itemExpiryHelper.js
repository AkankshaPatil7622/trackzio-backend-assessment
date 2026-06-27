const filterExpiredItems = async(itemsArray) => {
    let twoDays = new Date(Date.now() - 1 * 60 * 1000);
    let filteredArray = itemsArray.filter((item)=>item.addedAt > twoDays);
    return filteredArray;
}

module.exports = filterExpiredItems;