'use strict';
let _ = require('lodash');
let {loadAllItems} = require('../spec/fixtures');

function printReceipt(barcode) {
  let allItems = loadAllItems();
  let formattedBarcode = formatBarcode(barcode);
  let carItems = buildCarItems(formattedBarcode, allItems);
}
function formatBarcode(tags) {
  let tagArray = [];
  return _.chain(tags).map(tag=> {
    if (tag.includes('-')) {
      tagArray = tag.split('-');
      return {barcode: tagArray[0], count: parseFloat(tagArray[1])}
    } else {
      return {barcode: tag, count: 1};
    }
  })
    .value();
}
function _getExistElementByBarCode(array, barcode) {
  array.map(item=> {
    if (item.barcode === barcode) {
      return item;
    }
  });
  return null;
}
function _getCountItems(formattedBarcode) {
  let result = [];

  formattedBarcode.find(formatted=> {
    let countItem = _getExistElementByBarCode(result, formatted.barcode);
    if (countItem == null) {
      result.push({barcode: formatted.barcode, count: formatted.count});
    } else {
      countItem.count += formatted.count;
    }
  });
  return result;
}
function buildCarItems(formattedBarcode, allItems) {
  let result = [];
  let countItems = _getCountItems(formattedBarcode);
  countItems.map(
    countItem=> {
      let item = _getExistElementByBarCode(allItems, countItem.barcode);
      let cartItem = {
        barcode: item.barcode,
        name: item.name,
        unit: item.unit,
        price: item.price,
        count: countItem.count
      };
      result.push(cartItem);
    }
  );
  return result;
}
module.exports = {
  formatBarcode: formatBarcode,
  buildCarItems: buildCarItems
};
