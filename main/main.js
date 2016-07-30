'use strict';
let {loadAllItems,loadPromotions} = require('../spec/fixtures');
function printReceipt(tags) {

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
module.exports = {
  formatTags,
  countBarcodes,
  buildCartItems,
  buildPromotions,
  printReceipt
}
