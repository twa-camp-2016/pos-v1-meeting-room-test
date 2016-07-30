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

function printReceipt(tags) {
  let formattedTags=getFormattedTags(tags);
  console.log(formattedTags);
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
  getFormattedTags:getFormattedTags
}
