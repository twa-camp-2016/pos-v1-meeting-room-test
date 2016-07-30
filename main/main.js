'use strict';
let _ = require('lodash');
let loadAllItems = require('../spec/fixtures');
function printReceipt(tags){
  const allItems = loadAllItems();
  const cartItems = getCartItems(tags,allItems);
}

function getCartItems(tags,allItems) {
  let cartItems = [];

  for(let tag of tags){
    let splittedItems = tag.split('-');
    let barcode = splittedItems[0];
    let count = parseFloat(splittedItems[1] || 1);

    let cartItem =  cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if(cartItem){
      cartItem.count += count;
    }else {
      let item = allItems.find(item => item.barcode === barcode);
      cartItems.push({item,count});
    }
  }
  return cartItems;
}
module.exports = {
  printReceipt,
  getCartItems
};
