'use strict';

let _ = require('lodash');

function getElementByBarcode(array,barcode){
  return array.find((element) => element.barcode === barcode);
}

function getFormatedTags(tags) {
  return tags.map((tag) => {
    if(tag.includes('-')){
      let [barcode,count] = tag.split('-');
      return {
        barcode,
        count:parseFloat(count)
      }
    }else{
      return{
        barcode:tag,
        count:1
      }
    }
  });
}

function countBarcodes(formatedTags) {
  return formatedTags.reduce((result, formatedTag) => {
    let found = getElementByBarcode(result, formatedTag.barcode);
    if (found) {
      found.count += formatedTag.count;
    } else {
      result.push(formatedTag);
    }
    return result;
  },[]);
}

function buildCartItems(countBarcodes,allItems){
  return countBarcodes.map((countBarcode) => {
    let found = getElementByBarcode(allItems,countBarcode.barcode);
    return {
      barcode:found.barcode,
      name:found.name,
      unit:found.unit,
      price:found.price,
      count:countBarcode.count
    }
  })
}

module.exports = {
  getFormatedTags,
  countBarcodes,
  buildCartItems
}

