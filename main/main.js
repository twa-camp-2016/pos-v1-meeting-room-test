'use strict';
let tags = ['ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000003-2']
function getFormattedTags(tags) {
  let result = tags.map(tag=> {
    if (tag.includes('-')) {
      let [barcode,count]=tag.split('-');
      return {
        barcode: barcode, count: parseFloat(count)
      }
    } else {
      return {
        barcode: tag, count: 1
      }
    }
  });
  return result;
}
function printReceipt(tags) {
  let formattedTags = getFormattedTags(tags);
  return formattedTags;
}
console.log(printReceipt(tags));
module.exports = {getFormattedTags}
