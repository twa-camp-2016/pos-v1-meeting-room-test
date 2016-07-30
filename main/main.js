'use strict';
function loadAllItems() {
  return [
    {
      barcode: 'ITEM000000',
      name: '可口可乐',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000002',
      name: '苹果',
      unit: '斤',
      price: 5.50
    },
    {
      barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15.00
    },
    {
      barcode: 'ITEM000004',
      name: '电池',
      unit: '个',
      price: 2.00
    },
    {
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50
    }
  ];
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
let tags = ['ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000003-2'];
function getFormattedTags(tags) {
  let result = tags.map(tag=> {
    if (tag.includes('-')) {
      let [barcode,count]=tag.split('-');
      return {
        barcode: barcode, count: parseFloat(count)
      }
    } else {
      return {
        barcode: tag, count: 1
      }
    }
  });
  return result;
}
function getExitItemsByBarcode(array, barcode) {
  return array.find((n)=>n.barcode === barcode);
}
function getCount(formattedTags) {
  return formattedTags.reduce((result, formattedTag) => {
    let found = getExitItemsByBarcode(result, formattedTag.barcode);
    if (found) {
      found.count += formattedTag.count;
    } else {
      result.push(formattedTag);
    }
    return result;
  }, []);
}
function getCartItems(allItems, countBarcodes) {
  return countBarcodes.map(({barcode, count})=> {
    let {name, unit, price} = getExitItemsByBarcode(allItems, barcode);
    return {barcode, name, unit, price, count};
  });
}
function getPayPrice(promotions, cartItems) {
  let currentPromotion = promotions.find((promotion) => promotion.type === "BUY_TWO_GET_ONE_FREE");
  return cartItems.map((cartItem) => {
    let hasPromoted = currentPromotion.barcodes.includes(cartItem.barcode);
    let savedCount = Math.floor(cartItem.count / 3);
    let saved = hasPromoted ? savedCount * cartItem.price : 0;
    let payPrice = cartItem.price * cartItem.count - parseFloat(saved).toFixed(2);
    return Object.assign({}, cartItem, {payPrice, saved});
  });
}
function getTotalPrices(promotionItems) {
  return promotionItems.reduce((result, promotionItem)=> {
    result.totalPayPrice += promotionItem.payPrice;
    result.totalSaved += promotionItem.saved;
    return result;
  }, {totalPayPrice: 0, totalSaved: 0});
}
function getPrintModel(promotionItems, totalPrices) {
  return {
    receiptItems: promotionItems.map(({name, unit, count, price, payPrice}) => {
      return {name, unit, count, price, payPrice}}),
    totalPrices
}
function printReceipt(tags) {
  let formattedTags = getFormattedTags(tags);
  let countBarcodes = getCount(formattedTags);
  let allItems = loadAllItems();
  let cartItems = getCartItems(allItems, countBarcodes);
  let promotions = loadPromotions();
  let promotionItems = getPayPrice(promotions, cartItems);
  let totalPrices = getTotalPrices(promotionItems);
  let receiptModel = getPrintModel(promotionItems, totalPrices);
  return receiptModel;
}
console.log(printReceipt(tags));
module.exports = {
  getFormattedTags,
  getCount,
  loadAllItems,
  getCartItems,
  loadPromotions,
  getPayPrice,
  getTotalPrices,
  getPrintModel,
}
