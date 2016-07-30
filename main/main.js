'use strict';
let _ = require('lodash');
// let a = _.sum([4, 2, 8, 6]);
// console.log(a);

//#1
function formatTags(tags) {
  return tags.map((tag) => {
    if (tag.includes('-')) {
      let [barcode,count] = tag.split('-');
      return {barcode, count: parseInt(count)};
    } else {
      return {barcode: tag, count: 1};
    }
  });
}

//#2
function _getExistElementByBarcode(barcode, array) {
  return array.find((countItem) => {
    return barcode === countItem.barcode;
  });
}

function countBarcodes(formattedTags) {
  let result = [];
  formattedTags.forEach((formattedTag) => {
    let countItem = _getExistElementByBarcode(formattedTag.barcode, result);
    if (countItem === undefined) {
      result.push({barcode: formattedTag.barcode, count: formattedTag.count})
    } else {
      countItem.count += formattedTag.count;
    }
  });
  return result;
}


//#3
function buildCartItems(countedBarcodes, allItems) {
  return countedBarcodes.map((countedBarcode) => {
    let {name, unit, price} = _getExistElementByBarcode(countedBarcode.barcode, allItems);
    return {
      barcode: countedBarcode.barcode,
      name,
      unit,
      price,
      count: countedBarcode.count
    };
  });
}


module.exports = {
  formatTags,
  countBarcodes,
  buildCartItems
};
