'use strict';
function getFormatTags(tags) {
  let result=[];
  for(let tag of tags){
     if(tag.indexOf('-')==-1)
       result.push({
         barcode:tag,
         count:1
       });
    else{
       let[barcode,count]=tag.split('-');
        result.push({
            barcode,
            count:parseFloat(count)
        });
     }
  }
}
function getExistItemsByArray(barcode,array){
 return  array.find((elemnet)=>elemnet.barcode===barcode);
}
function  getCountedItems(formattedTags){
  let result=[];
  for(let formattedTag of formattedTags){
    let found=getExistItemsByArray(formattedTag.barcode,result);
     if(found){
      found.count += formattedTag.count
     }else {
         result.push({
         barcode: formattedTag.barcode,
         count: formattedTag.count
       });
     }
  }
  return result;
}

function buildCartItems(getCountedItems,allItems){
  return getCountedItems.map((countedItem)=>{
    let found=getExistItemsByArray(countedItem.barcode,allItems);
    if(found){
      return{
        barcode:found.barcode,
        name: found.name,
        unit: found.unit,
        price: found.price,
        count:countedItem.count
      }
    }
  });
}

function buildPromotionItems(cartItems,promotions){
  let currentPromotions=promotions[0];
   return cartItems.map(cartItem=>{
     let hasPromoted=currentPromotions.barcodes.includes(cartItem.barcode);
     let payPrice=cartItem.count*cartItem.price;
     let saved=0;
     if(hasPromoted===true){
       let saveCount = Math.floor(cartItem.count / 3);
        saved = cartItem.price * saveCount;
        payPrice=payPrice-saved;
     }
     return{
       barcode:cartItem.barcode,
       name: cartItem.name,
       unit: cartItem.unit,
       price: cartItem.price,
       count:cartItem.count,
       payPrice,
       saved
     }
   });
}

function calculateTotalPrice(promotedItems){
 return  promotedItems.reduce((result,item)=>{

   result.totalPayPrice+=item.payPrice;
   result.totalSaved+=item.saved;
   return result;
 },{totalPayPrice:0, totalSaved:0});

}
function buildReceipt(promotedItems,{totalPayPrice,totalSaved}){
  let cartItems =promotedItems.map(promotedItem=>{
    return{
      name: promotedItem.name,
      unit: promotedItem.unit,
      price:promotedItem.price,
      count:promotedItem.count,
      payPrice:promotedItem.payPrice,
    }
  });
  return{
    cartItems,
    totalPayPrice,
    totalSaved
  }
}
module.exports = {
  getFormatTags:getFormatTags,
  getCountedItems:getCountedItems,
  buildCartItems:buildCartItems,
  buildPromotionItems:buildPromotionItems,
  calculateTotalPrice:calculateTotalPrice,
  buildReceipt:buildReceipt

};
