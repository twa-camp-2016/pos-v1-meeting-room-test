'use strict';
let _ =require('lodash');
let {loadAllItems,loadPromotions} = require('../spec/fixtures')

function _getExitElementByBarcode(array,barcode) {
  return array.find((countItem)=> countItem.barcode === barcode);
}
function getFormatTags(tags){
  return tags.map((tag) => {
    if (tag.includes("-")) {
      let temps = tag.split("-");
      return {barcode: temps[0], count: parseFloat(temps[1])};
    }
    else {
      return ({barcode: tag, count: 1})
    }

  });
}

function countBarcodes(formattedTags) {
  let result = [];
  formattedTags.map(formattedTag=> {
    let countItem = _getExitElementByBarcode(result,formattedTag.barcode);
    if (countItem === undefined) {
      result.push({barcode: formattedTag.barcode, count: formattedTag.count});
    }
    else {
      countItem.count += formattedTag.count;
    }

  })
  return result;
}
function buildCartItems(countBarcodes, allItems) {
  let result = [];
  countBarcodes.map(countBarcode=>{
    let Item = _getExitElementByBarcode(allItems, countBarcode.barcode);
    let cartItems = {
      barcode: Item.barcode,
      name: Item.name,
      price: Item.price,
      count: countBarcode.count,
      unit:Item.unit

    }
    result.push(cartItems);
  })
  return result;
}
function buildPromotedItems(cartItems, promotions) {
  let result = [];
  let currentpromotion = promotions[0];
    cartItems.map(cartItem=>{
    let haspromotions = false;
    let saved = 0;
      currentpromotion.barcodes.map(barcode=>{
      if(barcode===cartItem.barcode) {
        haspromotions = true;
      }
    });

    if (promotions[0].type = 'BUY_TWO_GET_ONE_FREE' && haspromotions) {
      let saveCount = _.floor(cartItem.count/3);
      saved = saveCount*cartItem.price;
    }
    let payPrice = cartItem.count*cartItem.price-saved;

    result.push({
      barcode: cartItem.barcode,
      name: cartItem.name,
      unit: cartItem.unit,
      price: cartItem.price,
      count: cartItem.count,
      payPrice: payPrice,
      saved: saved
    })

  });
  return result;

}

function calcaculateTalPrices(promotedItems){
  let result;
  let totalPayPrice =0;
  let totalSaved = 0;
   promotedItems.map(promotedItem=>{
    totalPayPrice += promotedItem.payPrice,
      totalSaved += promotedItem.saved;
    result={
      totalPayPrice:totalPayPrice,
      totalSaved:totalSaved

    }
  })
  return result;
}
function buildReceipt(promotedItems,totalPrices) {
  let receiptItems = promotedItems.map((promotedItem) => {
    return {
      name: promotedItem.name,
      unit: promotedItem.unit,
      price: promotedItem.price,
      count: promotedItem.count,
      payPrice: promotedItem.payPrice
    }
  });
  return {
    receiptItems,
    totalPayPrice: totalPrices.totalPayPrice,
    totalSaved: totalPrices.totalSaved

  }
}
function buildReceiptString(receiptModel) {
  let totalPayPrice = receiptModel.totalPayPrice;
  let saved = receiptModel.totalSaved;
  let receiptItemsString = '***<没钱赚商店>收据***\n';
  for (let receiptItem of receiptModel.receiptItems) {
    receiptItemsString += '名称：' + receiptItem.name + '，数量：' + receiptItem.count + receiptItem.unit + '，单价：' + receiptItem.price.toFixed(2) + '(元)，小计：' + receiptItem.payPrice.toFixed(2) + '(元) ';
    receiptItemsString += "\n";
  }
  receiptItemsString+='----------------------\n' + '总计：' + totalPayPrice.toFixed(2) + "(元)\n" + '节省：' + saved.toFixed(2) + "(元)\n" + "**********************";

  return receiptItemsString;


}
function printReceipt(tags) {
  let allItems = loadAllItems();
  let formattedTags =getFormatTags(tags);
  let itemsTags = countBarcodes(formattedTags);
  let cartItems = buildCartItems(itemsTags, allItems);
  let promotions = loadPromotions();
  let promotedItems = buildPromotedItems(cartItems, promotions);
  let totalPrices = calcaculateTalPrices(promotedItems);
  let receipt= buildReceipt(promotedItems, totalPrices);
  let a=buildReceiptString(receipt);

}


module.exports = {
  getFormatTags:getFormatTags,
  countBarcodes:countBarcodes,
  buildCartItems:buildCartItems,
  buildPromotedItems:buildPromotedItems,
  calcaculateTalPrices:calcaculateTalPrices,
  buildReceipt:buildReceipt,
  printReceipt:printReceipt
}
