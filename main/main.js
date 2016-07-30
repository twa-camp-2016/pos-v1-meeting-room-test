'use strict';

let _ = require('lodash');

function formattedTags(tags) {
  let result = tags.map((tags)=> {
    if (tag.includes('-')) {
      let [barcode,count]=tag.split('-');
      return {barcode, count: parseFloat(count)}
    } else {
      return {barcode: tag, count: 1}
    }
  });
}
function getExistementByBarcode(array, barcode) {
  return array.find((barcode)=>formattedTag.barcode === barcode)
}

function countedBarcodes(formattedTags) {
  return formattedTags.map((formattedTag)=> {
    let found = getExistementByBarcode(result, formattedTag.barcode)
  });
  if (found) {
    result.push({barcode: tags, count: formattedTag.count})
  } else {
    return {barcde: tags, count: 1}
  }
  formattedTag.count += formattedTag.count;
  return result;
}


module.exports = {
  formattedTags: formattedTags, countedBarcodes: countedBarcodes,

};
