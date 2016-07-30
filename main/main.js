'use strict';
let _ = require('lodash');
let {loadAllItems} = require('../spec/fixtures.js');
let {loadPromotions} = require('../spec/fixtures.js');

function formatTags(tags) {
  return _.map(tags,tag =>{
    if(tag.includes('-')){
      let [barcode,count] = tag.split('-');
      return {
        barcode,count: parseFloat(count)
      }
    }
    else{
      return {barcode: tag,count: 1}
    }
  });
}

function _getExitElementByBarcodes(array,barcode) {
  return _(array).find(element => element.barcode === barcode);
}

function countBarcodes(formattedTags) {
  return _(formattedTags).reduce((result,formattedTag) => {
    let found = _getExitElementByBarcodes(result,formattedTag.barcode);
    if(found){
      found.count += formattedTag.count;
    }
    else{
      result.push(formattedTag);
    }
    return result;
  },[]);
}

module.exports = {
  formatTags:formatTags,
  countBarcodes:countBarcodes
};