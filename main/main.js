'use strict';
let _ = require('lodash');
function printReceipt(barcode) {

}
function formatBarcode(tags) {
  let tagArray = [];
  return _.chain(tags).map(tag=> {
    if (tag.includes('-')) {
      tagArray = tag.split('-');
      return {barcode: tagArray[0], count: parseFloat(tagArray[1])}
    } else {
      return {barcode:tag,count:1};
    }
  })
    .value();
}
module.exports = {
  formatBarcode: formatBarcode,
};
