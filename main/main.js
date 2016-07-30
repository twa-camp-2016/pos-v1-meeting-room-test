'use strict';
let _ = require("lodash");
function printReceipt(tags) {
     let formattedItems = formatedItem(tags);

}
function formatedItem(tags) {
        return _.map((tags),tag =>{
          if(tag.includes('-')){
            let [barcode,count] = tag.split("-");
            return { barcode, count:parseFloat(count)}
          }else {
              return{barcode:tag,count:1}
          }
        });
}
module.exports = {
      printReceipt:printReceipt,
      formatedItem:formatedItem,
}
