'use strict';
let _ = require('lodash');
let tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];
function loadAllItems() {
  return [
    {barcode: 'ITEM000000', name: '可口可乐', unit: '瓶', price: 3.00},
    {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00},
    {barcode: 'ITEM000002', name: '苹果', unit: '斤', price: 5.50},
    {barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15.00},
    {barcode: 'ITEM000004', name: '电池', unit: '个', price: 2.00},
    {barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.50}];
}
function loadPromotions() {
  return [
    {
      type: 'BUY_TWO_GET_ONE_FREE',
      barcodes: [
        'ITEM000000',
        'ITEM000001',
        'ITEM000005'
      ]
    }
  ];
}
function getFormattedTags(tags) {
  return _.chain(tags).map(x=> {
    if (_.includes(x, '-')) {
      let [barcode, count] = _.split(x, '-');
      return {
        barcode,
        count: parseFloat(count)
      }
    } else {
      return {
        barcode: x,
        count: 1
      }
    }
  }).value();
}

function getExistByBarcode(array, barcode) {
  for (let countItem of array) {
    if (countItem.barcode == barcode) {
      return countItem;
    }
  }
  return null;
}

function getCountBarcodes(formattedTags) {
  let result = [];
  _.map(formattedTags, x=> {
    let countItem = getExistByBarcode(result, x.barcode);
    if (countItem === null) {
      result.push({barcode: x.barcode, count: x.count});
    } else {
      countItem.count += x.count;
    }
  });
  return result;
}

function buildCartItems(countedBarcodes, allItems) {
  let result = [];
  _.map(countedBarcodes, x=> {
    let item = getExistByBarcode(allItems, x.barcode);
    let cartItem = {
      barcode: item.barcode,
      name: item.name,
      unit: item.unit,
      price: item.price,
      count: x.count
    };
    result.push(cartItem);
  });
  return result;
}

function _fixPrice(number) {
  return parseFloat(number.toFixed(2))
}

function buildPromotedItems(cartItems, promotions) {
  let currentPromotion = _.find(promotions, x=> x.type === 'BUY_TWO_GET_ONE_FREE');
  return _.map(cartItems, x=> {
    let hasPromoted = _.includes(currentPromotion.barcodes, x.barcode);
    let totalPrice = x.price * x.count;
    let payPrice = _.parseInt(x.count / 3) * x.price * 2 + (x.count % 3) * x.price;
    let saved = hasPromoted ? totalPrice - payPrice : 0;
    return _.assign({}, x, {payPrice, saved: _fixPrice(saved)});
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
  let savedItems = _.chain(promotedItems).filter(x=> x.saved > 0).map(({name, count, unit})=> {
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
  let lines = [`***<没钱赚商店>收据***
`];
  for (let {name, count, unit, price, payPrice, saved} of receiptModel.promotedItems) {
    let line = `名称：${name}, 数量：${count}${unit}, 单价：${price.toFixed(2)}(元), 小计：${payPrice.toFixed(2)}(元)
`;
    lines.push(line)
  }
  let hasSaved = receiptModel.savedItems.length > 0;
  lines.push(`----------------------
`);
  lines.push(`总计：${receiptModel.totalPayPrice.toFixed(2)}(元)
`);
  if (hasSaved) {
    lines.push(`节省：${receiptModel.totalSaved.toFixed(2)}(元)
`);
  }
  lines.push(`**********************
`);
  let receiptString = lines.join('');
  return receiptString;
}

module.exports = {
  getFormattedTags: getFormattedTags,
  getCountBarcodes: getCountBarcodes,
  buildCartItems: buildCartItems,
  loadAllItems: loadAllItems,
  loadPromotions: loadPromotions,
  buildPromotedItems: buildPromotedItems,
  calculateTotalPrices: calculateTotalPrices,
  buildReceipt: buildReceipt,
  buildReceiptString: buildReceiptString
};
