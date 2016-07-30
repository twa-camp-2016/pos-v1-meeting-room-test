'use strict';

let {loadAllItems, loadPromotions} = require('../spec/fixtures.js');
let _ = require('lodash');

function buildCartItems(tags, allItems) {
  const cartItems = [];

  for(const tag of tags){
    const splittedTag = tag.split('-');
    const barcode = splittedTag[0];
    const  count = parseFloat(splittedTag[1] || 1);

    const cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if(cartItem){
      cartItem.count += count;
    }else{
      const item = allItems.find(item => item.barcode === barcode);

      cartItems.push({item:item, count:count});
    }
  }

  return cartItems;
}

function buildReceiptItems(cartItems, promotions) {
  const receiptItems = [];

  for (let cartItem of cartItems) {
    const subtotal = cartItem.count * cartItem.item.price;
    let barcode = promotions[0].barcodes.find(n => n === cartItem.item.barcode);
    if (barcode) {

      cartItem.count >= 2 ? receiptItems.push({
        cartItem: cartItem,
        subtotal: subtotal - cartItem.item.price, saved: cartItem.item.price
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
    expectText +=
`名称:${receiptItem.cartItem.item.name}，\
数量：${receiptItem.cartItem.count}${receiptItem.cartItem.item.unit}，\
单价：${formatMoney(receiptItem.cartItem.item.price)}(元)，\
小计：${formatMoney(receiptItem.subtotal)}(元)
`}
  expectText +='----------------------\n';
  expectText +=`总计：${formatMoney(receipt.total)}(元)
节省：${formatMoney(receipt.totalSaved)}(元)
**********************`;

  console.log(expectText);
}

function formatMoney(money) {
  return money.toFixed(2);
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
