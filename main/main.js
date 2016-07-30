'use strict';
let {loadAllItems,loadPromotions} = require('../spec/fixtures');
let _ = require('lodash');
function printReceipt(tags) {
  let formattedTags = formatTags(tags);
  let countedBarcodes= countBarcodes(formattedTags);
  let allItems = loadAllItems();
  let cartItems = buildCartItems(countedBarcodes,allItems);
  let promotions = loadPromotions();
  let promotedItems = buildPromotions(cartItems,promotions);
  let totalPrices = calculateTotalPrices(promotedItems);
  let receipt = buildReceipt(promotedItems,totalPrices);
}

function formatTags(tags) {
  return tags.map((tag)=>{
    if(tag.includes('-')){
      let [barcode,count] = tag.split('-');
      return {barcode,count:parseFloat(count)};
    }else {
      return {barcode:tag,count:1};
    }
  })
}

function _getExistElementByBarcodes(array, barcode) {
  return array.find((item)=> item.barcode === barcode);
}

function countBarcodes(formattedTags) {
  return formattedTags.reduce((result,formattedTag)=>{
    let found = _getExistElementByBarcodes(result,formattedTag.barcode);
    if(found){
      found.count+=formattedTag.count;
    }else {
      result.push({barcode:formattedTag.barcode,count:formattedTag.count});
    }
    return result;
  },[])

}

function buildCartItems(countedBarcodes,allItems) {
  return countedBarcodes.map(({barcode,count})=>{
    let {name,unit,price} = _getExistElementByBarcodes(allItems,barcode);
    return {
      barcode,
      name,
      unit,
      price,
      count
    };
  })
}

function buildPromotions(cartItems, promotions) {
  let currentPromotion = promotions.find((promotion) => promotion.type === 'BUY_TWO_GET_ONE_FREE');
  return cartItems.map((cartItem)=>{
    let hasPromoted = false;
    let saved = 0;
    let payPrice = 0;
    let promotBarcode = currentPromotion.barcodes.find((barcode)=>barcode === cartItem.barcode);
    if(promotBarcode){
      hasPromoted = true;
    }

    if(hasPromoted){
      saved = cartItem.price*Math.floor(cartItem.count/3);
    }

    payPrice = cartItem.price*cartItem.count-saved;
    return {
      barcode:cartItem.barcode,
      name:cartItem.name,
      unit:cartItem.unit,
      price:cartItem.price,
      count:cartItem.count,
      payPrice,
      saved
    };
  })
}

function calculateTotalPrices(promotedItems) {
  return {
    totalPayPrice:_.sumBy(promotedItems,'payPrice'),
    totalSaved:_.sumBy(promotedItems,'saved')
  };
}

function buildReceipt(promotedItems, {totalPayPrice,totalSaved}) {
  return {
    receiptItems:promotedItems.map(({name,unit,price,count,payPrice,saved})=>{
      return {name,unit,price,count,payPrice,saved};
    }),
    totalPayPrice,
    totalSaved
  }
}

module.exports = {
  formatTags,
  countBarcodes,
  buildCartItems,
  buildPromotions,
  calculateTotalPrices,
  buildReceipt,
  printReceipt
}
