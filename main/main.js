'use strict';
function printReceipt(tags) {

}

function formatTags(tags) {
  return tags.map((tag)=>{
    if(tag.includes('-')){
      let [barcode,count] = tag.split('-');
      return {barcode,count:parseFloat(count)};
    }else {
      return {barcode:tag,count:1};
    }
  })
}

function countBarcodes(formatedTags) {

}
module.exports = {
  formatTags,
  countBarcodes,
  printReceipt
}
