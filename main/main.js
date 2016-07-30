'use strict';
let {loadAllItems,loadPromotions} = require('../spec/fixtures')
function printReceipt(tags) {
  let formattedItems = getFormattedItems(tags);
  let countBarcode = getCountBarcodes(formattedItems);
  let allItems = loadAllItems();
  let cartItems = buildCartItems(countBarcode,allItems);
  let promotions = loadPromotions();
  let promotedItems = buildPromotedItems(cartItems,promotions);
}
function getFormattedItems(tags) {
  return tags.map((tag) => {
    if(tag.includes('-')){
      let [barcode,count] = tag.split('-');
      return {barcode,count:parseFloat(count)}
    }else{
      return{barcode: tag,count: 1}
    }
  })
}
function _geExitsElementByBarcode(arrays,barcode) {
  return arrays.find((array) => array.barcode === barcode);
}
function getCountBarcodes(formatTags) {
  return formatTags.reduce((result,formatTag) => {
    let element = _geExitsElementByBarcode(result,formatTag.barcode);
    if(element){
      element.count += formatTag.count;
    }else{
      result.push(formatTag)
    }
    return result
  },[])
}
function buildCartItems(countBarcodes,allItems) {
  return countBarcodes.map(({barcode,count}) => {
    let {name,unit,price} = _geExitsElementByBarcode(allItems,barcode);
    return {barcode,name,unit,price,count};
  })
}

function buildPromotedItems(cartItems,promotions) {
  // let currentPromotion = promotions.find((promotion) => promotion.type ==='BUY_TWO_GET_ONE_FREE');
  let currentPromotion = promotions.find((promotion) => promotion.type === 'BUY_TWO_GET_ONE_FREE');
  return cartItems.map((cartItem) => {
    let hasPromoted = currentPromotion.barcodes.includes(cartItem.barcode);
    let saved = hasPromoted ?  Math.floor(cartItem.count / 3)*cartItem.price : 0;
    let payPrice = cartItem.count*cartItem.price - saved;
    
    return Object.assign({},cartItem,{payPrice,saved})
  })
}
module.exports = {
  printReceipt,
  getFormattedItems,
  getCountBarcodes,
  buildCartItems,
  buildPromotedItems
}
