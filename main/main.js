'use strict';
let {
  loadAllItems,
  loadPromotions
} = require('../spec/fixtures');
function getFormatedTags(tags) {
  return tags.map((tag)=> {
    let found = tag.includes('-');
    if (found) {
      let [barcode,count] = tag.split('-');
      return {barcode, count: parseFloat(count)}
    } else {
      return {barcode: tag, count: 1}
    }
  })
}

function getBarcode(barcode, array) {
  for (let arr of array) {
    if (arr.barcode === barcode) {
      return arr;
    }
  }
  return null;
}
function getCountTags(formatedTags) {
  let result = [];
  for (let formatedTag of formatedTags) {
    let found = getBarcode(formatedTag.barcode, result);
    if (found === null) {
      result.push(formatedTag);
    } else {
      found.count += formatedTag.count;
    }
  }
  return result;
}

function getCartItems(allItems, formatedItems) {
  return formatedItems.map(({barcode, count}) => {
    let {name, price, unit} = getName(barcode, allItems);
    return {barcode, name, unit, price, count}
  })
}

function getName(barcode, array) {
  return array.find((arr) => arr.barcode === barcode);
}

function getPromotionItems(promotions, cartItems) {
  let currentPromotion = promotions[0];
  return cartItems.map(({barcode, name, unit, price, count}) => {
    let found = currentPromotion.barcodes.includes(barcode);
    let payPrice = 0;
    let saved = 0;
    if (found) {
      let savedCount = Math.floor(count / 3);
      saved = price * savedCount;
      payPrice = count * price - saved;
    } else {
      payPrice = count * price;
    }
    return {
      barcode,
      name,
      unit,
      price,
      count,
      payPrice,
      saved
    }
  })
}

function calulateTotalPrice(promotionItems) {
  return promotionItems.reduce((result, {payPrice, saved}) => {
    result.totalPrice += payPrice;
    result.totalSaved += saved;
    return result;
  }, {totalPrice: 0, totalSaved: 0})
}

function buildReceipt(promotedItems, {totalPrice, totalSaved}) {
  return {
    items: promotedItems,
    totalPrice,
    totalSaved
  }
}

function buildReceiptSting({items, totalPrice, totalSaved}) {
  let lines = ['***<没钱赚商店>收据***'];
  for (let {name, unit, price, count, payPrice} of items) {
    let line = `名称：${name}，数量：${count}${unit}，单价：${price.toFixed(2)}(元)，小计：${payPrice.toFixed(2)}(元)`;
    lines.push(line)
  }
  lines.push('----------------------');
  lines.push(`总计：${totalPrice.toFixed(2)}(元)`);
  lines.push(`节省：${totalSaved.toFixed(2)}(元)`);
  lines.push('**********************');
  return lines.join('\n');
}

function printReceipt(tags) {
  let formatedTags = getFormatedTags(tags);
  let countTags = getCountTags(formatedTags);
  let allItems = loadAllItems();
  let cartItems = getCartItems(allItems,countTags);
  let promotions = loadPromotions();
  let promotionItems = getPromotionItems(promotions,cartItems);
  let totalPrice = calulateTotalPrice(promotionItems);
  let receipt = buildReceipt(promotionItems,totalPrice);
  let receiptString = buildReceipt(receipt);
  return receiptString;
}

module.exports = {
  getFormatedTags: getFormatedTags,
  getCountTags: getCountTags,
  getCartItems: getCartItems,
  getPromotionItems: getPromotionItems,
  calulateTotalPrice: calulateTotalPrice,
  buildReceipt: buildReceipt,
  buildReceiptSting,
  printReceipt
}

