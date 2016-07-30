'use strict';

function printReceipt(tags) {
  let formattedItems = getFormattedItems(tags);
  let countBarcode = getCountBarcodes(formattedItems);
}
function getFormattedItems(tags) {
  return tags.map((tag) => {
    if(tag.includes('-')){
      let [barcode,count] = tag.split('-');
      return {barcode,count:parseFloat(count)}
    }else{
      return{barcode: tag,count: 1}
    }
  })
}
function _geExitsElementByBarcode(arrays,barcode) {
  return arrays.find((array) => array.barcode === barcode);
}
function getCountBarcodes(formatTags) {
  return formatTags.reduce((result,formatTag) => {
    let element = _geExitsElementByBarcode(result,formatTag.barcode);
    if(element){
      element.count += formatTag.count;
    }else{
      result.push(formatTag)
    }
    return result
  },[])
}
module.exports = {
  printReceipt,
  getFormattedItems,
  getCountBarcodes
}
