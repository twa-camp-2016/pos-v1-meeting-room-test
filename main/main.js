'use strict';
let _ = require('lodash');
let {loadAllItems, loadPromotions} = require('../spec/fixtures.js');

function getFormattedTags(tags) {
  return _.map(tags, tag=> {
    if (_.includes(tag, '-')) {
      let [barcode, count] = _.split(tag, '-');
      return {barcode, count: parseFloat(count)}
    } else {
      return {barcode: tag, count: 1}
    }
  });
}

function getExistByBarcode(array, barcode) {
  return _.find(array, (countItem)=> countItem.barcode === barcode);
}

function getCountBarcodes(formattedTags) {
  return _.reduce(formattedTags, (result, formattedTag)=> {
    let countItem = getExistByBarcode(result, formattedTag.barcode);
    if (countItem) {
      countItem.count += formattedTag.count;
    } else {
      result.push({barcode: formattedTag.barcode, count: formattedTag.count});
    }
    return result;
  }, []);
}

function buildCartItems(countedBarcodes, allItems) {
  return _.map(countedBarcodes, countedBarcode=> {
    let item = getExistByBarcode(allItems, countedBarcode.barcode);
    return {
      barcode: item.barcode,
      name: item.name,
      unit: item.unit,
      price: item.price,
      count: countedBarcode.count
    };
  });
}

function _fixPrice(number) {
  return parseFloat(number.toFixed(2));
}

function buildPromotedItems(cartItems, promotions) {
  let currentPromotion = _.find(promotions, promotion=> promotion.type === 'BUY_TWO_GET_ONE_FREE');
  return _.map(cartItems, cartItem=> {
    let hasPromoted = _.includes(currentPromotion.barcodes, cartItem.barcode);
    let totalPrice = cartItem.price * cartItem.count;
    let payPrice = _.parseInt(cartItem.count / 3) * cartItem.price * 2 + (cartItem.count % 3) * cartItem.price;
    let saved = hasPromoted ? totalPrice - payPrice : 0;
    return _.assign({}, cartItem, {payPrice, saved: _fixPrice(saved)});
  });
}

function calculateTotalPrices(promotedItems) {
  return _.reduce(promotedItems, (result, {payPrice, saved})=> {
    result.totalPayPrice += payPrice;
    result.totalSaved += saved;
    return result;
  }, {totalPayPrice: 0, totalSaved: 0});
}

function buildReceipt(promotedItems, {totalPayPrice, totalSaved}) {
  let savedItems = _.chain(promotedItems)
    .filter(x=> x.saved > 0)
    .map(({name, count, unit})=> {
      return {name, count, unit}
    }).value();

  return {
    promotedItems: promotedItems.map(({name, unit, price, count, payPrice, saved})=> {
      return {name, unit, price, count, payPrice, saved}
    }),
    savedItems,
    totalPayPrice, totalSaved
  }
}

function buildReceiptString(receiptModel) {
  let lines = [`***<没钱赚商店>收据***`];
  for (let {name, count, unit, price, payPrice} of receiptModel.promotedItems) {
    let line = `名称：${name}，数量：${count}${unit}，单价：${price.toFixed(2)}(元)，小计：${payPrice.toFixed(2)}(元)`;
    lines.push(line)
  }
  let hasSaved = receiptModel.savedItems.length > 0;
  lines.push(`----------------------`);
  lines.push(`总计：${receiptModel.totalPayPrice.toFixed(2)}(元)`);
  if (hasSaved) {
    lines.push(`节省：${receiptModel.totalSaved.toFixed(2)}(元)`);
  }
  lines.push(`**********************`);
  let receiptString = lines.join('\n');
  //require(`fs`).writeFileSync('1.txt', receiptString);
  // console.log(receiptString);
  return receiptString;
}

function receipt(tags) {
  let formattedTags = getFormattedTags(tags);
  let countBarcodes = getCountBarcodes(formattedTags);
  let allItems = loadAllItems();
  let promotions = loadPromotions();
  let cartItems = buildCartItems(countBarcodes, allItems);
  let promotedItems = buildPromotedItems(cartItems, promotions);
  let totalPrice = calculateTotalPrices(promotedItems);
  let receiptModel = buildReceipt(promotedItems, totalPrice);
  let receipt=buildReceiptString(receiptModel);
  console.log(receipt);
  // return buildReceiptString(receiptModel);
}
const tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];
receipt(tags);

module.exports = {
  getFormattedTags: getFormattedTags,
  getCountBarcodes: getCountBarcodes,
  buildCartItems: buildCartItems,
  buildPromotedItems: buildPromotedItems,
  calculateTotalPrices: calculateTotalPrices,
  buildReceipt: buildReceipt,
  buildReceiptString: buildReceiptString,
  receipt: receipt
};
