'use strict';
let _=require('lodash');
let {loadAllItems,loadPromotions}=require('../spec/fixtures.js');

function getFormattedTags(tags) {
  return _(tags).map((tag)=>{
    if(tag.includes('-')){
      let temps=tag.split('-');
      return {barcode:temps[0],count:parseFloat(temps[1])};
    }else {
      return {barcode:tag,count:1};
    }
  }).value();
}

function _getExistElementByBarcode(array,barcode) {
  return _(array).find(countItem=>countItem.barcode===barcode);
}
function getCountedItems(formattedTags) {
  let result=[];
  _(formattedTags).map((formattedTag)=>{
    let countedItem=_getExistElementByBarcode(result,formattedTag.barcode);
    if(countedItem){
      countedItem.count+=formattedTag.count;
    }else {
      result.push(formattedTag);
    }
  }).value();
  return result;
}

function buildCartItems(countedItems,allItems) {
  return _(countedItems).map(({barcode,count})=>{
    let {name,unit,price}=_getExistElementByBarcode(allItems,barcode);
    return {
      barcode,
      name,
      unit,
      price,
      count
    }
  }).value();
}
function _fixPrice(number) {
  return parseFloat(number.toFixed(2));
}
function buildPromotedItems(cartItems,promotions) {
  let currentPromotion=_(promotions).find((promotion)=>promotion.type==='BUY_TWO_GET_ONE_FREE');
  return _(cartItems).map((cartItem)=>{
    let totalPrice=cartItem.count*cartItem.price;
    let hasPromoted=currentPromotion.barcodes.includes(cartItem.barcode);
    let saved=0;
    if(hasPromoted&&cartItem.count>=2){
      let savedCount=Math.floor(cartItem.count/3);
      saved=savedCount*cartItem.price;
    }
    let payPrice=totalPrice-saved;
    return Object.assign({},cartItem,{payPrice,saved:_fixPrice(saved)});

  }).value();
}
function calculateTotalPrices(promotedItems) {
  return _(promotedItems).reduce((result,{payPrice,saved})=>{
    result.totalPayPrice+=payPrice;
    result.totalSaved+=saved;
    return result;
  },{totalPayPrice:0,totalSaved:0})
}

function buildReceipt(promotedItems,totalPrices) {
  let promotedItem=_(promotedItems).map(({name,unit,price,count,payPrice})=>{
    return {name,unit,price:price,count,payPrice};
  }).value();

  return {
    promotedItem,
    totalPayPrice:totalPrices.totalPayPrice,
    totalSaved:totalPrices.totalSaved
  }
}
function buildReceiptString(receipt) {
  // console.log(receipt);
  let lines=['***<没钱赚商店>收据***'];
  for(let {name,count,unit,price,payPrice} of receipt.promotedItem){
    let line=`名称：${name}，数量：${count}${unit}，单价：${price.toFixed(2)}(元)，小计：${payPrice.toFixed(2)}(元)`;
    lines.push(line);
  }
  lines.push('----------------------');
  lines.push(`总计：${receipt.totalPayPrice.toFixed(2)}(元)`);
  // console.log(receipt.totalSaved);
  lines.push(`节省：${receipt.totalSaved.toFixed(2)}(元)`);
  lines.push('**********************');
  let receiptString=lines.join('\n');
  require(`fs`).writeFileSync('1.txt',receiptString);
  return receiptString;
}
function printReceipt(tags) {
  let formattedTags=getFormattedTags(tags);
  // console.log(formattedTags);
  let countedItems=getCountedItems(formattedTags);
  // console.log(countedItems);
  let allItems=loadAllItems();
  let cartItems=buildCartItems(countedItems,allItems);
  // console.log(cartItems);
  let promotions=loadPromotions();
  let promotedItems=buildPromotedItems(cartItems,promotions);
  // console.log(promotedItems);
  let totalPrices=calculateTotalPrices(promotedItems);
  // console.log(totalPrices);
  let receipt=buildReceipt(promotedItems,totalPrices);
  // console.log(receipt);
  let receiptString=buildReceiptString(receipt);
  console.log(receiptString);
}
let tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001-2',
  'ITEM000001-2',
  'ITEM000003-3.5',
  'ITEM000005-2'
];

printReceipt(tags);
module.exports = {
  getFormattedTags:getFormattedTags,
  getCountedItems:getCountedItems,
  loadAllItems:loadAllItems,
  buildCartItems:buildCartItems,
  loadPromotions:loadPromotions,
  buildPromotedItems:buildPromotedItems,
  calculateTotalPrices:calculateTotalPrices,
  buildReceipt:buildReceipt,
  buildReceiptString:buildReceiptString,
  printReceipt:printReceipt
};
