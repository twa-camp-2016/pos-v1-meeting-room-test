'use strict';
let tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];
let _ = require('lodash');
function getFormattedTags(tags) {
  return _.chain(tags).map(x=> {
    if (_.includes(x, '-')) {
      let [barcode, count] = _.split(x, '-');
      return {
        barcode,
        count: parseFloat(count)
      }
    } else {
      return {
        barcode: x,
        count: 1
      }
    }
  }).value();
}

function getExistByBarcode(array, barcode) {
  for (let countItem of array) {
    if (countItem.barcode == barcode) {
      return countItem;
    }
  }
  return null;
}

function getCountBarcodes(formattedTags) {
  let result = [];
  _.map(formattedTags, x=> {
    let countItem = getExistByBarcode(result, x.barcode);
    if (countItem === null) {
      result.push({barcode: x.barcode, count: x.count});
    } else {
      countItem.count += x.count;
    }
  });
  return result;
}
let formattedTags = getFormattedTags(tags);
getCountBarcodes(formattedTags);

module.exports = {
  getFormattedTags: getFormattedTags,
  getCountBarcodes: getCountBarcodes
}
