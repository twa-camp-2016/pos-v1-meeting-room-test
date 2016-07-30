'use strict';

let _ = require('lodash');

function getElementByBarcode(array,barcode){
  return array.find((element) => element.barcode === barcode);
}

function getFormatedTags(tags) {
  return tags.map((tag) => {
    if(tag.includes('-')){
      let [barcode,count] = tag.split('-');
      return {
        barcode,
        count:parseFloat(count)
      }
    }else{
      return{
        barcode:tag,
        count:1
      }
    }
  });
}



module.exports = {
  getFormatedTags
}

