'use strict';

function printReceipt(tags) {
  let formattedItems = getFormattedItems(tags);
}
function getFormattedItems(tags) {
  return tags.map((tag) => {
    if(tag.includes('-')){
      let {barcode,count} = tag.split('-');
      return {barcode,count:parseFloat(count)}
    }else{
      return{barcode: tag,count: 1}
    }
  })
}
module.exports = {
  printReceipt,
  getFormattedItems
}
