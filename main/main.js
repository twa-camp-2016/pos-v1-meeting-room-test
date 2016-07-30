'use strict';
let _ = require('lodash');
let {
  loadAllItems,
  loadPromotions
}= require('../spec/fixtures');

function printReceipt(tags) {
  const allItems = loadAllItems();
  const cartItems = getCartItems(tags, allItems);
  const allPromotions = loadPromotions();
  const receiptItems = getReceiptItems(cartItems, allPromotions);
  const totalSaves = getTotalItems(receiptItems);
}

function getCartItems(tags, allItems) {
  let cartItems = [];

  for (let tag of tags) {
    let splittedItems = tag.split('-');
    let barcode = splittedItems[0];
    let count = parseFloat(splittedItems[1] || 1);

    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count += count;
    } else {
      let item = allItems.find(item => item.barcode === barcode);
      cartItems.push({item, count});
    }
  }
  return cartItems;
}

function getReceiptItems(cartItems, allPromotions) {
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(cartItem.item.barcode, allPromotions);
    let {subtotal,save} = discount(cartItem,promotionType);
    return {
      cartItem,
      subtotal,
      save
    }
  });
}

function getPromotionType(barcode, allPromotions) {
  let promotion = allPromotions.find(promotion => promotion.barcodes.some(b => b === barcode));
  return promotion ? promotion.type : undefined;
}

function discount(cartItem,promotionType){
  let freeItemCount = 0;
  if(promotionType === 'BUY_TWO_GET_ONE_FREE'){
    freeItemCount = parseInt(cartItem.count/3);
  }
  let save = cartItem.item.price * freeItemCount;
  let subtotal = cartItem.item.price * cartItem.count - save;
  return {subtotal,save};
}

function getTotalItems(receiptItems) {
  let total = 0;
  let saves = 0;

  for(let receiptItem of receiptItems){
    total += receiptItem.subtotal;
    saves += receiptItem.save;
  }
  return {total,saves};
}
module.exports = {
  printReceipt,
  getCartItems,
  getReceiptItems,
  getTotalItems
};
