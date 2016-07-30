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
function getExistItemsByArray(barcode,array){
 return  array.find((elemnet)=>elemnet.barcode===barcode);
}
function  getCountedItems(formattedTags){
  let result=[];
  for(let formattedTag of formattedTags){
    let found=getExistItemsByArray(formattedTag.barcode,result);
     if(found){
      found.count += formattedTag.count
     }else {
         result.push({
         barcode: formattedTag.barcode,
         count: formattedTag.count
       });
     }
  }
  return result;
}

function buildCartItems(getCountedItems,allItems){
  return getCountedItems.map((countedItem)=>{
    let found=getExistItemsByArray(countedItem.barcode,allItems);
    if(found){
      return{
        barcode:found.barcode,
        name: found.name,
        unit: found.unit,
        price: found.price,
        count:countedItem.count
      }
    }
  });
}

module.exports = {
  getFormatTags:getFormatTags,
  getCountedItems:getCountedItems,
  buildCartItems:buildCartItems
};
