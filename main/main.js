'use strict';
let {loadAllItems, loadPromotions} = require('../spec/fixtures');
function printReceipt(tags) {
  let allItems = loadAllItems();
  let formattedTags = getFormattedItems(tags);
  let countItems = getCountItems(formattedTags);
  let cartItems = buildCartItems(countItems, allItems);

  let promotions = loadPromotions();
  let promotedItems = buildPromotedItems(cartItems, promotions);
  let totalPrice = calculateTotalPrice(promotedItems);
  let receipt = buildReceipt(promotedItems, totalPrice);
  let receiptString = printReceiptString(receipt);
  console.log(receiptString);
  return receiptString;
}

function _getExistElementByBarCode(array, barcode) {
  for (let countItem of array) {
    if (countItem.barcode == barcode) {
      return countItem;
    }
  }
  return null;
}

function getFormattedItems(tags) {
  let result = [];

  for (let tag of tags) {
    if (tag.indexOf('-') == -1) {
      result.push({barcode: tag, count: 1});
    } else {
      let temp = tag.split("-");
      result.push({barcode: temp[0], count: parseFloat(temp[1])});
    }
  }
  return result;
}

function getCountItems(formattedTags) {
  let result = [];

  for (let formattedTag of formattedTags) {
    let countItem = _getExistElementByBarCode(result, formattedTag.barcode);
    if (countItem == null) {
      result.push({barcode: formattedTag.barcode, count: formattedTag.count});
    } else {
      countItem.count += formattedTag.count;
    }
  }
  return result;
}

function buildCartItems(formattedItems, allItems) {
  let result = [];
  let countItems = getCountItems(formattedItems);
  countItems.map(countItem=> {
    let item = _getExistElementByBarCode(allItems, countItem.barcode);
    let cartItem = {
      barcode: item.barcode,
      name: item.name,
      unit: item.unit,
      price: item.price,
      count: countItem.count
    };
    result.push(cartItem);
  });
  return result;
}
function buildPromotedItems(cartItems, promotions) {
  let result = [];
  let currentPromotion = promotions[0];

  cartItems.map(cartItem => {
    let saved = 0;
    let hasPromoted = false;
    for (let barcode of currentPromotion.barcodes) {
      if (cartItem.barcode == barcode) {
        hasPromoted = true;
      }
    }
    if (currentPromotion.type == "BUY_TWO_GET_ONE_FREE") {
      let temp = Math.floor(cartItem.count / 3);
      saved += temp * cartItem.price;
    }

    let payPrice = cartItem.count * cartItem.price - saved;
    result.push({
      barcode: cartItem.barcode,
      name: cartItem.name,
      unit: cartItem.unit,
      price: cartItem.price,
      count: cartItem.count,
      saved,
      payPrice
    });
  });
  return result;
}

function calculateTotalPrice(promotedItems) {
  let result = {
    totalPayPrice: 0,
    totalSaved: 0
  };

  for (let e of promotedItems) {
    result.totalSaved += e.saved;
    result.totalPayPrice += e.payPrice;
  }
  return result;
}

function buildReceipt(promotedItems, totalPrices) {
  let receiptItems = [];

  for (let element of promotedItems) {
    receiptItems.push({
      name: element.name,
      unit: element.unit,
      price: element.price,
      count: element.count,
      payPrice: element.payPrice
    });
  }

  return {
    receiptItems,
    totalPayPrice: totalPrices.totalPayPrice,
    totalSaved: totalPrices.totalSaved
  };
}

function printReceiptString(receipt) {
  let totalPayPrice = receipt.totalPayPrice;
  let saved = receipt.totalSaved;
  let receiptItemsString = "";
  for (let receiptItem of receipt.receiptItems) {
    receiptItemsString += `名称：${receiptItem.name}，数量：${receiptItem.count}${receiptItem.unit}，单价：${receiptItem.price.toFixed(2)}(元)，小计：${receiptItem.payPrice.toFixed(2)}(元)`;
    receiptItemsString += "\n";
  }
  const result = `***<没钱赚商店>收据***
${receiptItemsString}----------------------
总计：${totalPayPrice.toFixed(2)}(元)
节省：${saved.toFixed(2)}(元)
**********************`;
  return result;
}

module.exports = {
  getFormattedItems: getFormattedItems,
  buildCartItems: buildCartItems,
  buildPromotedItems: buildPromotedItems,
  calculateTotalPrice: calculateTotalPrice,
  buildReceipt: buildReceipt,
  printReceiptString: printReceiptString,
  printReceipt: printReceipt
};





