'use strict';

let _ = require('lodash');
let fixtures = require('../spec/fixtures')

function getElementByBarcode(array,barcode){
  return array.find((element) => element.barcode === barcode);
}

function getFormatedTags(tags) {
  return tags.map((tag) => {
    if(tag.includes('-')){
      let [barcode,count] = tag.split('-');
      return {
        barcode,
        count:parseFloat(count)
      }
    }else{
      return{
        barcode:tag,
        count:1
      }
    }
  });
}

function countBarcodes(formatedTags) {
  return formatedTags.reduce((result, formatedTag) => {
    let found = getElementByBarcode(result, formatedTag.barcode);
    if (found) {
      found.count += formatedTag.count;
    } else {
      result.push(formatedTag);
    }
    return result;
  },[]);
}

function buildCartItems(countBarcodes,allItems){
  return countBarcodes.map((countBarcode) => {
    let found = getElementByBarcode(allItems,countBarcode.barcode);
    return {
      barcode:found.barcode,
      name:found.name,
      unit:found.unit,
      price:found.price,
      count:countBarcode.count
    }
  })
}

function getPromotedCartInfo(cartItems,promotions) {
  let currentPromotion = promotions[0];
  let hasPromoted = false;

  return cartItems.map((cartItem) => {
      if(currentPromotion.barcodes.includes(cartItem.barcode)){
        hasPromoted = true;
        let savdCount = Math.floor(cartItem.count / 3);
        var saved = cartItem.price * savdCount;
      }else{
        var saved = 0;
      }
    return {
      barcode:cartItem.barcode,
      name:cartItem.name,
      unit:cartItem.unit,
      price:cartItem.price,
      count:cartItem.count,
      payPrice:cartItem.count * cartItem.price - saved,
      saved:saved
    }
  })
}

function calculateTotalPrice(promotedCartsInfo) {
  return promotedCartsInfo.reduce((result,promotedCartInfo) => {
     result.totalPayPrice += promotedCartInfo.payPrice;
     result.totalSaved += promotedCartInfo.saved;
    return result;
  },{totalPayPrice:0,totalSaved:0})
}

function buildReceipt(promotedCartsInfo,totalPrices){
  let result = [];
  let receiptItems = [];

  for(let element of promotedCartsInfo){
    receiptItems.push({
      name:element.name,
      unit:element.unit,
      price:element.price,
      count:element.count,
      totalPayPrice:element.payPrice
    });
  }
  result = {
    receiptItem:receiptItems,
    totalPayPrice:totalPrices.totalPayPrice,
    totalSaved:totalPrices.totalSaved
  };
  return result;
}

function buildReceiptString(receipt){
  let totalPayPrice = receipt.totalPayPrice;
  let totalSaved = receipt.totalSaved;

  let receiptString = '';

  for(let cartReceipt of receipt.receiptItem){
    receiptString += `名称：${cartReceipt.name},数量:${cartReceipt.count}${cartReceipt.unit},单价：${cartReceipt.price.toFixed(2)}(元),小计：${cartReceipt.totalPayPrice.toFixed(2)}(元)`;
    receiptString +='\n';
  }
  const result = `***<没钱赚商店>收据***
${receiptString}----------------------
总计：${totalPayPrice.toFixed(2)}(元)
节省：${totalSaved.toFixed(2)}(元)
**********************`;
  console.log(result);
  return result;
}

function printReceipt(receiptString) {
  let allItems = fixtures.loadAllItems();
  let promotions = fixtures.loadPromotions();
  let formatedTags = getFormatedTags(receiptString);
  let countedBarcodes = countBarcodes(formatedTags);
  let cartItems = buildCartItems(countedBarcodes, allItems);
  let promotedCarts = getPromotedCartInfo(cartItems, promotions);
  let totalPrices = calculateTotalPrice(promotedCarts);
  let receipt = buildReceipt(promotedCarts, totalPrices);
  let receiptStr = buildReceiptString(receipt);

  console.log(receiptStr);
}

module.exports = {
  getFormatedTags,
  countBarcodes,
  buildCartItems,
  getPromotedCartInfo,
  calculateTotalPrice,
  buildReceipt,
  buildReceiptString,
  printReceipt
}

