'use strict';
function getFormatTags(tags) {
  let result=[];
  for(let tag of tags){
     if(tag.indexOf('-')==-1)
       result.push({
         barcode:tag,
         count:1
       });
    else{
       let[barcode,count]=tag.split('-');
        result.push({
            barcode,
            count:parseFloat(count)
        });
     }
  }
}

module.exports = {
  getFormatTags:getFormatTags
};
