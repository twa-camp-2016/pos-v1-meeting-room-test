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

function _getExistElement(array, barcode) {
  return array.find((item)=> {return item.barcode === barcode});
}

function countBarcodes(formattedTags) {
  return formattedTags.reduce((result,formattedTag)=>{
    let found = _getExistElement(result,formattedTag.barcode);
    if(found){
      found.count+=formattedTag.count;
    }else {
      result.push({barcode:formattedTag.barcode,count:formattedTag.count});
    }
    return result;
  },[])

}
module.exports = {
  formatTags,
  countBarcodes,
  printReceipt
}
