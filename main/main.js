'use strict';
let _ = require('lodash')
function formatTags(tags){
  return tags.map((tag)=>{
    if(tag.includes('-')){
      let [barcode,count] = tag.split('-');
      return {barcode,count:parseFloat(count)}
    }else{
      return {barcode:tag, count:1}
    }
  });
}
function _getExistentElementByBarcode(array,barcode){
  return array.find( arr =>  arr.barcode === barcode );
}
function countTags(formattedTags){
 return formattedTags.reduce((result,tag)=>{
  let element = _getExistentElementByBarcode(result,tag.barcode);
  if(element){
    element.count += tag .count;
  }else{
    result.push({barcode:tag.barcode,count:tag.count});
  }
  return result;
},[])
}
function getCartItems(countedBarcodes,allItems){
  return countedBarcodes.map(({barcode,count})=>{
    let {name,unit,price} = _getExistentElementByBarcode(allItems, barcode);
    return {barcode,name,unit,price,count};
  });
}
function _fixPrice(number){
  return parseFloat(number.toFixed(2))
}
function getPromotionItems(cartItems,promotions){
  let currentPromotion = promotions.find((promotion)=>promotion.type="BUY_TWO_GET_ONE_FREE")
  return cartItems.map((cartItem)=>{
    let haspromoted = currentPromotion.barcodes.includes(cartItem.barcode)&&cartItem.count>2;
    let totalprice = cartItem.price*cartItem.count;
    let saved = haspromoted?cartItem.price * cartItem.count/3:0;
    let payprice = totalprice-saved;
    return Object.assign({},cartItem,{
      payprice,
      saved:_fixPrice(saved)
    })
  })
}

function getTotalprice(promotedItems){
  return promotedItems.reduce((result,{payprice,saved})=>{
      result.totalpayprice += payprice;
      result.totalsaved += saved;
      return result;
    },
    {totalpayprice:0,totalsaved:0})
}
function getReceipt(promotedItems, totalPrices){
  return {
    receiptItems:promotedItems.map(({name,unit,price,count,payprice,saved})=>{
      return {name,unit,price,count,payprice,saved}
    }),
    totalpayprice:totalPrices.totalpayprice,
    totalsaved:totalPrices.totalsaved
  }
}
function getReceiptString(receipt){
  let totalprice = receipt.totalpayprice;
  let saved = receipt.totalsaved;
  let receiptString = "";
  for(let receiptItem of receipt.receiptItems){
    receiptString += `名称:${receiptItem.name},数量:${receiptItem.count},单价:${receiptItem.price.toFixed(2)}(元),小计:${receiptItem.payprice.toFixed(2)}(元)`;
    receiptString += "\n";
  }
  const result = `***<没钱赚商店>收据***
${receiptString}----------------------
总计:${totalprice.toFixed(2)}(元)
节省:${saved.toFixed(2)}(元)
**********************`;
  return result;
}
function printReceipt(tags){
  let allItems = loadAllItems();
  let formattedTags = formatTags(tags);
  let countedBarcodes = countTags(formattedTags);
  let cartItems = getCartItems(countedBarcodes,allItems);
  let promotions = loadPromotions();
  let promotionItems = getPromotionItems(cartItems,promotions);
  let totalprice = getTotalprice(promotionItems);
  let receiptItems = getReceipt(promotionItems,totalprice);
  let receiptString = printReceipt(receiptItems);
  console.log(receiptString);

}
module.exports = {
  formatTags:formatTags,
  countTags:countTags,
  getCartItems:getCartItems,
  getPromotionItems:getPromotionItems,
  getTotalprice:getTotalprice,
  getReceipt:getReceipt,
  getReceiptString:getReceiptString
}
