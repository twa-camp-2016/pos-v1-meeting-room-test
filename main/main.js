'use strict';
let _ = require('lodash');
// let a = _.sum([4, 2, 8, 6]);
// console.log(a);

//#1
function formatTags(tags) {
  return tags.map((tag) => {
    if (tag.includes('-')) {
      let [barcode,count] = tag.split('-');
      return {barcode, count: parseInt(count)};
    } else {
      return {barcode: tag, count: 1};
    }
  });
}

//#2
function _getExistElementByBarcode(barcode, array) {
  return array.find((countItem) => {
    return barcode === countItem.barcode;
  });
}

function countBarcodes(formattedTags) {
  let result = [];
  formattedTags.forEach((formattedTag) => {
    let countItem = _getExistElementByBarcode(formattedTag.barcode, result);
    if (countItem === undefined) {
      result.push({barcode: formattedTag.barcode, count: formattedTag.count})
    } else {
      countItem.count += formattedTag.count;
    }
  });
  return result;
}


//#3
function buildCartItems(countedBarcodes, allItems) {
  return countedBarcodes.map((countedBarcode) => {
    let {name, unit, price} = _getExistElementByBarcode(countedBarcode.barcode, allItems);
    return {
      barcode: countedBarcode.barcode,
      name,
      unit,
      price,
      count: countedBarcode.count
    };
  });
}

//#4
function buildPromotedItems(cartItems, promotions) {
  let currentPromotion = promotions[0];
  return cartItems.map((cartItem) => {
    let saved = 0;
    let hasPromoted = currentPromotion.barcodes.includes(cartItem.barcode);
    if (hasPromoted && currentPromotion.type === 'BUY_TWO_GET_ONE_FREE') {
      let savedCount = Math.floor(cartItem.count / 3);
      saved = savedCount * cartItem.price;
    }
    let payPrice = cartItem.count * cartItem.price - saved;

    return {
      barcode: cartItem.barcode,
      name: cartItem.name,
      unit: cartItem.unit,
      price: cartItem.price,
      count: cartItem.count,
      payPrice,
      saved
    };
  });
}

//#5
function calculateToTalPrices(promotedItems) {
  let totalPrice = _.sumBy(promotedItems, 'payPrice');
  let totalSaved = _.sumBy(promotedItems, 'saved');
  return {
    totalPrice,
    totalSaved
  };
}


//#6
function buildReceipt(promotedItems, totalPrices) {
  let receiptItems = promotedItems.map((promotedItem) => {
    return {
      name: promotedItem.name,
      unit: promotedItem.unit,
      price: promotedItem.price,
      count: promotedItem.count,
      payPrice: promotedItem.payPrice
    };
  });

  return {
    receiptItems,
    totalPayPrice: totalPrices.totalPayPrice,
    totalSaved: totalPrices.totalSaved
  };
}


module.exports = {
  formatTags,
  countBarcodes,
  buildCartItems,
  buildPromotedItems,
  calculateToTalPrices,
  buildReceipt
};
