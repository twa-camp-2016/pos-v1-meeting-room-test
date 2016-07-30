

'use strict';

function buildFormattedBarcode(input){
  return input.map((item)=>{
    if(item.includes('-')){
      let found = item.split('-');
      return {barcode:found[0], count:parseInt(found[1])}
    }else{
      return {barcode:item, count:1}
    }
  })
}
function buildCountedBarcode(input){
  
}

module.exports = {
  buildFormattedBarcode
}
