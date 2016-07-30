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
function printReceipt(tags) {
  let formattedTags=getFormattedTags(tags);
  // console.log(formattedTags);
  let countedItems=getCountedItems(formattedTags);
  // console.log(countedItems);
}
let tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2'
];
printReceipt(tags);
module.exports = {
  getFormattedTags:getFormattedTags,
  getCountedItems:getCountedItems
}
