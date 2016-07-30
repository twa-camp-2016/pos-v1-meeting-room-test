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
  return array.find((item)=> {return item.barcode === barcode});
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
module.exports = {
  formatTags,
  countBarcodes,
  buildCartItems,
  printReceipt
}
