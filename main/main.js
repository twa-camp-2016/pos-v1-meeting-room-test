'use strict';
let _ = require('lodash');
let {loadAllItems, loadPromotions} = require('../spec/fixtures');

function formatTags(tags) {
  return _.map(tags, tag => {
    if (tag.includes('-')) {
      let [barcode,count] = tag.split('-');
      return {barcode, count: parseFloat(count)};
    } else {
      return {barcode: tag, count: 1};
    }
  })
}
function _getExistElementByBarcodes(array, barcode) {
  return _.find(array, item => item.barcode === barcode);
}

function countBarcodes(formattedTags) {
  return _.reduce(formattedTags, (result, formattedTag)=> {
    let found = _getExistElementByBarcodes(result, formattedTag.barcode);
    if (found) {
      found.count += formattedTag.count;
    } else {
      result.push({barcode: formattedTag.barcode, count: formattedTag.count});
    }
    return result;
  }, [])

}

function getCartItems(countedBarcodes, allItems) {
  return _.map(countedBarcodes, ({barcode, count})=> {
    let {name, unit, price} = _getExistElementByBarcodes(allItems, barcode);
    return {barcode, name, unit, price, count};
  })
}

function getPromotions(cartItems, promotions) {
  let currentPromotion = promotions.find((promotion) => promotion.type === 'BUY_TWO_GET_ONE_FREE');
  return cartItems.map(({price, count, barcode, name, unit})=> {
    let hasPromoted = currentPromotion.barcodes.find(b => b === barcode);
    let saved = hasPromoted ? price * Math.floor(count / 3) : 0;
    let payPrice = price * count - saved;
    return {barcode, name, unit, price, count, payPrice, saved};
  })
}

function getTotalPrices(promotedItems) {
  return {
    totalPayPrice: _.sumBy(promotedItems, promotedItem => promotedItem.payPrice),
    totalSaved: _.sumBy(promotedItems, promotedItem => promotedItem.saved)
  };
}

function getReceipt(promotedItems, {totalPayPrice, totalSaved}) {
  return {
    receiptItems: promotedItems.map(({name, unit, price, count, payPrice, saved})=> {
      return {name, unit, price, count, payPrice, saved};
    }),
    totalPayPrice,
    totalSaved
  }
}

function getReceiptString(receipt) {
  let totalprice = receipt.totalPayPrice;
  let saved = receipt.totalSaved;
  let receiptString = "";
  for(let receiptItem of receipt.receiptItems){
    receiptString += `名称:${receiptItem.name},数量:${receiptItem.count},单价:${receiptItem.price.toFixed(2)}(元),小计:${receiptItem.payPrice.toFixed(2)}(元)`;
    receiptString += "\n";
  }
  const result = `***<没钱赚商店>收据***
${receiptString}----------------------
总计:${totalprice.toFixed(2)}(元)
节省:${saved.toFixed(2)}(元)
**********************`.trim();
  return result;
}
function printReceipt(tags) {
  let formattedTags = formatTags(tags);
  let countedBarcodes = countBarcodes(formattedTags);
  let allItems = loadAllItems();
  let cartItems = getCartItems(countedBarcodes, allItems);
  let promotions = loadPromotions();
  let promotedItems = getPromotions(cartItems, promotions);
  let totalPrices = getTotalPrices(promotedItems);
  let receipt = getReceipt(promotedItems, totalPrices);
  let receiptString = getReceiptString(receipt);
  console.log(receiptString);
}
module.exports = {
  formatTags,
  countBarcodes,
  getCartItems,
  getPromotions,
  getTotalPrices,
  getReceipt,
  getReceiptString,
  printReceipt
};
