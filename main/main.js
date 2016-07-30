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
function _getElementById(array, Id) {
  return array.find((element)=>element.id===Id);
}

function Receipt(tags)
{
  let formattedCounts=formatCartCount(tags);
}

Receipt(tags);

module.exports = {
  formatCartCount:formatCartCount
};
