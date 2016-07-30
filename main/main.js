'use strict';
const tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];
function getItems(tags){
  //let allItems=loadAllItems();
  //let promotions=loadPromotions();
  let tagsItem=getTags(tags);
  //console.log(tagsItem);
  let countedTags=getCountedTags(tagsItem);
  console.log(countedTags);
}
getItems(tags);
function getTags(tags){
  return tags.map((tag)=>{
    if(tag.includes('-')){
      let [barcode,count]=tag.split("-");
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
function _existByBarcode(array,barcode){
  return array.find((item)=>item.barcode===barcode);
}
function getCountedTags(tagsItem){
  return tagsItem.reduce(((result,tag)=>{
    let temp=_existByBarcode(result,tag.barcode);

    if(temp){
      //console.log("ssss");
      temp.count+=tag.count;
    }else{
      result.push(tag);
    }
    return result;
  }),[]);
}
module.exports = {
getTags:getTags,
  getCountedTags:getCountedTags
};
