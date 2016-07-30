'use strict';

let {loadAllItems, loadPromotions} = require('../spec/fixtures.js');
let _ = require('lodash');

function buildCartItems(tags, allItems) {
  const cartItems = [];

  for (let tag of tags) {
    let splittedTag = tag.split('-');
    let count = parseFloat(splittedTag[1] || 1);
    let barcode = splittedTag[0];

    let cartItem = cartItems.find(n => n.barcode === barcode);
    if (cartItem) {
      cartItem.count += count;
    } else {
      let item = allItems.find(n => n.barcode === barcode);
      cartItems.push({item: item, count: count});
    }

    return cartItems;
  }
}

function buildReceiptItems(cartItems, promotions) {
  const receiptItems = [];

  for (let cartItem of cartItems) {
    const subtotal = cartItem.count * cartItem.item.price;
    let barcode = promotions[0].barcodes.find(n => n === cartItem.item.barcode);
    if (barcode) {
      
      barcode.count >= 2 ? receiptItems.push({
        cartItem: cartItem,
        subtotal: subtotal, saved: cartItem.item.price
      }) : receiptItems.push({cartItem: cartItem, subtotal: subtotal, saved: 0});
    }else {
    receiptItems.push({cartItem: cartItem, subtotal: subtotal, saved: 0});
    }
  }

  return receiptItems;
}

function buildReceipt(receiptItems) {
  let total = 0;
  let totalSaved = 0;
  for (let receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    totalSaved += receiptItem.saved;
  }
  return {receiptItem: receiptItems, total: total ,totalSaved: totalSaved};
}

function buildReceiptText(receipt){
  let expectText = '***<没钱赚商店>收据***\n';

  for(let receiptItem of receipt.receiptItem){
    expectText += `名称:${receiptItem.cartItem.item.name}，\
数量：${receiptItem.cartItem.count}${receiptItem.cartItem.item.unit}，\
单价：${receiptItem.cartItem.item.price}(元)，\
小计：${receiptItem.subtotal}(元)
`}
  expectText +='----------------------';
  expectText +=`总计：${receipt.total}(元)
节省：${receipt.totalSaved}(元)
**********************`;
  console.log(expectText);
}

function printReceipt(input) {
  let allItems = loadAllItems();

  let cartItems = buildCartItems(input, allItems);

  let promotions = loadPromotions();
  let receiptItems = buildReceiptItems(cartItems, promotions);

  let receipt = buildReceipt(receiptItems);
  buildReceiptText(receipt);
}

module.exports = {printReceipt, buildCartItems, buildReceiptItems, buildReceipt};
