'use strict';
let _ = require("lodash");
function printReceipt(tags) {
  let formattedItems = formatedItem(tags);
  let countedBarcodes = countBarcode(formattedItems);


}
function formatedItem(tags) {
  return _.map((tags), tag => {
    if (tag.includes('-')) {
      let [barcode,count] = tag.split("-");
      return {barcode, count: parseFloat(count)}
    } else {
      return {barcode: tag, count: 1}
    }
  });
}

function _getExistElementByItem(array, barcode) {
  return _.find((array), element => element.barcode === barcode);
}

function countBarcode(formattedItems) {
  // return _.map((formattedItems),formattedItem =>{
  //       let {name,price} = _getExistElementByItem(formattedItem);
  // });
  return _.reduce(formattedItems, (result, formattedItem) => {
    let found = _getExistElementByItem(result, formattedItem.barcode);
    if (found) {
      found.count += formattedItem.count;
    } else {
      result.push(formattedItem);
    }
    return result;
  }, []);
}

module.exports = {
  printReceipt: printReceipt,
  formatedItem: formatedItem,
  countBarcode:countBarcode,
}
