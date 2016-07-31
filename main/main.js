'use strict';
let {loadAllItems, loadPromotions} = require('../spec/fixtures');

function buildFormattedBarcode(input) {
  return input.map((item)=> {
    if (item.includes('-')) {
      let [barcode,count] = item.split('-');
      return {barcode, count: parseFloat(count)}
    } else {
      return {barcode: item, count: 1}
    }
  })
}

function buildCountedBarcode(formattedBarcodes) {
  return formattedBarcodes.reduce((result, formattedItem)=> {
    let found = result.find((item)=>item.barcode === formattedItem.barcode);
    if (found) {
      found.count += formattedItem.count;
    } else {
      result.push(formattedItem);
    }
    return result;
  }, [])
}

function buildCartBarcode(countedItems, allItems) {
  return countedItems.map(({barcode, count})=> {
    let {name, unit, price,} = allItems.find((item)=>item.barcode === barcode);
    return {barcode, name, unit, price, count}
  })
}

function buildPromotionItems(cartItems, promotions) {
  let promotion = promotions[0];
  return cartItems.map(({barcode, name, unit, price, count})=> {
    let existByBarcode = promotion.barcodes.find((item)=>item === barcode);
    let haveDiscount = existByBarcode && promotion.type === 'BUY_TWO_GET_ONE_FREE';
    let save = haveDiscount ? Math.floor(count / 3) * price : 0;
    let payPrice = count * price - save;
    return {barcode, name, unit, price, count, save, payPrice}
  })
}

function buildTotalItems(promotionItems) {
  return promotionItems.reduce((result, {save, payPrice})=> {
    result.totalSaved += save;
    result.totalPrice += payPrice;
    return result;
  }, {totalSaved: 0, totalPrice: 0})
}

function buildReceipt(promotionItems, {totalPrice, totalSaved}) {
  let receiptItems = promotionItems.map(({name, unit, price, count, saved, payPrice})=> {
    return {name, unit, price, count, saved, payPrice}
  });
  return {receiptItems, totalPrice, totalSaved}
}

function buildReceiptString({receiptItems,totalPrice,totalSaved}) {
  let receiptItemString = '';
  receiptItems.forEach(({name, count, unit, price, payPrice})=> {
    receiptItemString += `名称：${name}，数量：${count}${unit}，单价：${price.toFixed(2)}(元)，小计：${payPrice.toFixed(2)}(元)\n`
  });
  return `***<没钱赚商店>收据***
${receiptItemString}----------------------
总计：${totalPrice.toFixed(2)}(元)
节省：${totalSaved.toFixed(2)}(元)
**********************`;
}

function printReceipt(tags) {
  let allItems = loadAllItems();
  let promotions = loadPromotions();
  let formarttedBarcode = buildFormattedBarcode(tags);
  let countedBarcode = buildCountedBarcode(formarttedBarcode);
  let cartItems = buildCartBarcode(countedBarcode, allItems);
  let promotionItems = buildPromotionItems(cartItems, promotions);
  let total = buildTotalItems(promotionItems);
  let receiptItem = buildReceipt(promotionItems, total);
  let receipt = buildReceiptString(receiptItem);
  console.log(receipt);
}

module.exports = {
  buildFormattedBarcode,
  buildCountedBarcode,
  buildCartBarcode,
  buildPromotionItems,
  buildTotalItems,
  buildReceipt,
  printReceipt
};
