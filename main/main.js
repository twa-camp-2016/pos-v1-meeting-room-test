'use strict';
//#1
 let {loadAllItems} = require('../spec/fixtures.js');
let {loadPromotions} = require('../spec/fixtures.js');
'use strict';

function formattedTags(tags) {
  return tags.map((tag) => {
    if (tag.includes('-')) {
      let [barcode,count] = tag.split('-');
      return {
        barcode,
        count: parseFloat(count)
      }
    }
    else {
      return {
        barcode: tag,
        count: 1
      }
    }
  })
}
//#2
function _isExistBarcodes(array, barcode) {
  return array.find((element) => element.barcode === barcode);
}

function countItems(formattedTags) {
  return formattedTags.reduce((result, formattedTag)=> {
    let exist = _isExistBarcodes(result, formattedTag.barcode);
    if (exist) {
      exist.count += formattedTag.count;
    }
    else {
      result.push(formattedTag)
    }
    return result;
  },[]);
}
function countItems(formattedTags) {
  return formattedTags.reduce((result, formattedTag) => {
    let found = _isExistBarcodes(result, formattedTag.barcode);

    if (found) {
      found.count += formattedTag.count;
    } else {
      result.push(formattedTag);
    }
    return result;
  }, []);
}
//#3
function buildCartItems(countedBarcodes, allItems) {
  return countedBarcodes.map(({barcode, count}) => {
    let {name, unit, price} = _isExistBarcodes(allItems, barcode);
    return {barcode, name, unit, price, count,payPrice:price*count}
  })
}
//#4
function buildPromotedItems(cartItems, promotions){
  let result = [];
  let currentPromotion = promotions[0];
  for (let cartItem of cartItems) {
    let saved = 0;
    let hasPromoted = false;
    for (let barcode of currentPromotion.barcodes) {
      if (cartItem.barcode === barcode) {
        hasPromoted = true;
      }
    }
    if (currentPromotion.type === 'BUY_TWO_GET_ONE_FREE' && hasPromoted && cartItem.count > 2) {
      var savedCount = Math.floor(cartItem.count / 3);
      saved = cartItem.price * savedCount;
    }
    let payPrice = cartItem.count * cartItem.price - saved;
    result.push({
      barcode: cartItem.barcode,
      name: cartItem.name,
      unit: cartItem.unit,
      price: cartItem.price,
      count: cartItem.count,
      payPrice,
      saved
    });
  }
  return result;
}
//#5
function calculateTotalPrices(promotions){
  let result = {
    totalPayPrice:0,//总计
    totalSaved:0//总节省
  };
  for(let promotion of promotions){
    result.totalPayPrice += promotion.payPrice;
    result.totalSaved += promotion.saved;
  }
  return result;
}
//#6
function buildReceipt(promotedItems, totalPrices) {
  let result = [];
  promotedItems.map((Items) => result.push(Items));
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
  }
}
function printReceiptString(receipt) {
  let receiptString = '***<没钱赚商店>收据***';
  for (let receiptItem of receipt.receiptItems) {
    receiptString += `
 名称：${receiptItem.name}，数量：${receiptItem.count}${receiptItem.unit}，单价：${receiptItem.price.toFixed(2)}(元)，小计：${receiptItem.payPrice.toFixed(2)}(元)`;
  }

  receiptString += `
 ----------------------
`
}
    /*
Object({ barcode: 'ITEM0001', name: '雪碧', unit: '瓶', price: 3, count: 3, payPrice: 9, saved: 0 }),
Object({ barcode: 'ITEM0002', name: '苹果', unit: '斤', price: 5.5, count: 3, payPrice: 16.5, saved: 0 ]
to equal
Object({ barcode: 'ITEM0001', name: '雪碧', unit: '瓶', price: 3, count: 3, payPrice: 6, saved: 3 }
Object({ barcode: 'ITEM0002', name: '苹果', unit: '斤', price: 5.5, count: 3, payPrice: 16.5, saved: 0 }) ].
     */

module.exports = {
  formattedTags: formattedTags,
  countItems:countItems,
  buildCartItems:buildCartItems,
  buildPromotedItems:buildPromotedItems,
  calculateTotalPrices:calculateTotalPrices,
  buildReceipt:buildReceipt

};
