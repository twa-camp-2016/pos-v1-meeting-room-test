'use strict';

//TODO: 请在该文件中实现练习要求并删除此注释
let _ = require('lodash');
let tags=[
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];
function formatCartCount(tags){
  let a=_.chain(tags)
    .map(x=>{
      if(x.includes('-'))
      {
        return {barcode:x.split('-')[0],count:parseFloat(x.split('-')[1])}
      }else
        return {barcode:x,count:1}
    })
    .value();
  //console.log(a);
  return a;
}
function _getElementById(array, barcode) {
  return array.find((element)=>element.barcode===barcode);
}

function getCartCounts(formattedCounts){

  let b= formattedCounts.reduce((result,formattedTag)=>{
    let found=_getElementById(result,formattedTag.barcode);
    //console.log(result);
    //console.log(formattedTag);
    //console.log(found);
    if(found){
      found.count+=formattedTag.count;
    }else
    {
      result.push(formattedTag);
    }
    return result;
  },[]);
return b;
//console.log(b);
}

function Receipt(tags)
{
  let formattedCounts=formatCartCount(tags);
  let cartCount=getCartCounts(formattedCounts)
}

Receipt(tags);

module.exports = {
  formatCartCount:formatCartCount,
  getCartCounts:getCartCounts
};



// return foodCounts.map(({id, count})=> {
//   let found = _getElementById(allItems, id);
//   return {id, name: found.name, count, price: found.price};
//
// });
