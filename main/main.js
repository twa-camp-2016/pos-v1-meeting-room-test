'use strict';
let _=require('lodash');

function getFormattedTags(tags) {
  return tags.map((tag)=>{
    if(tag.includes('-')){
      let temps=tag.split('-');
      return {barcode:temps[0],count:parseFloat(temps[1])};
    }else {
      return {barcode:tag,count:1};
    }
  });
}

function _getExistElementByBarcode(array,barcode) {
  return array.find(countItem=>countItem.barcode===barcode);
}
function getCountedItems(formattedTags) {
  let result=[];
  formattedTags.map((formattedTag)=>{
    let countedItem=_getExistElementByBarcode(result,formattedTag.barcode);
    if(countedItem){
      countedItem.count+=formattedTag.count;
    }else {
      result.push(formattedTag);
    }
  })
  return result;
}

function buildCartItems(countedItems,allItems) {
  return countedItems.map(({barcode,count})=>{
    let {name,unit,price}=_getExistElementByBarcode(allItems,barcode);
    return {
      barcode,
      name,
      unit,
      price,
      count
    }
  })
}
function _fixPrice(number) {
  return parseFloat(number.toFixed(2));
}
function buildPromotedItems(cartItems,promotions) {
  let currentionPromotion=promotions.find((promotion)=>promotion.type==='BUY_TWO_GET_ONE_FREE');
  return cartItems.map((cartItem)=>{
    let totalPrice=cartItem.count*cartItem.price;
    let hasPromoted=currentionPromotion.barcodes.includes(cartItem.barcode);
    let saved=0;
    if(hasPromoted&&cartItem.count>=2){
      let savedCount=Math.floor(cartItem.count/3);
      saved=savedCount*cartItem.price;
    }
    let payPrice=totalPrice-saved;
    return Object.assign({},cartItem,{payPrice:_fixPrice(payPrice),saved:_fixPrice(saved)});

  })
}
function calculateTotalPrices(promotedItems) {
  return promotedItems.reduce((result,{payPrice,saved})=>{
    result.totalPayPrice+=payPrice;
    result.totalSaved+=saved;
    return result;
  },{totalPayPrice:0,totalSaved:0})
}

function buildReceipt(promotedItems,totalPrices) {
  let promotedItem=promotedItems.map(({name,unit,price,count,payPrice})=>{
    return {name,unit,price:price,count,payPrice};
  });

  return {
    promotedItem,
    totalPayPrice:_fixPrice(totalPrices.totalPayPrice),
    totalSaved:_fixPrice(totalPrices.totalSaved)
  }
}
function buildReceiptString(receipt) {
  let lines=['***<没钱赚商店>收据***'];
  for(let {name,count,unit,price,payPrice} of receipt.promotedItem){
    let line=`名称：${name}，数量：${count}${unit}，单价：${price.toFixed(2)}(元)，小计：${payPrice.toFixed(2)}(元)`;
    lines.push(line);
  }
  lines.push('----------------------');
  lines.push(`总计：${receipt.totalPayPrice.toFixed(2)}(元)`);
  lines.push(`节省：${receipt.totalSaved.toFixed(2)}(元)`);
  lines.push('**********************');
  // let receiptString=lines.join('\n');
  return lines.join('\n');

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

// let tags = [
//   'ITEM000001',
//   'ITEM000001',
//   'ITEM000003-2.5',
//   'ITEM000005',
//   'ITEM000005-2'
// ];
function loadAllItems() {
  return [
    {
      barcode: 'ITEM000000',
      name: '可口可乐',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000002',
      name: '苹果',
      unit: '斤',
      price: 5.50
    },
    {
      barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15.00
    },
    {
      barcode: 'ITEM000004',
      name: '电池',
      unit: '个',
      price: 2.00
    },
    {
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50
    }
  ];
}
function loadPromotions() {
  return [
    {
      type: 'BUY_TWO_GET_ONE_FREE',
      barcodes: [
        'ITEM000000',
        'ITEM000001',
        'ITEM000005'
      ]
    }
  ];
}
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
}
