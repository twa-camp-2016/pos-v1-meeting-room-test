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
    return Object.assign({},cartItem,{payPrice,saved});

  })
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
  console.log(promotedItems);
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
  buildPromotedItems:buildPromotedItems
}
