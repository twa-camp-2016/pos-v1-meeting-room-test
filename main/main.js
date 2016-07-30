
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

function buildCountedBarcode(formattedBarcodes){
  return formattedBarcodes.reduce((result,formmatedItem)=>{
    let found = result.find((item)=>item.barcode===formmatedItem.barcode);
    if(found){
      found.count+=formmatedItem.count;
    }else{
      result.push(formmatedItem);
    }
    return result;
  },[])
}
function buildCartBarcode(countedItems,allItems){
  return countedItems.map((barcode,count)=>{
    console.log(allItems);
    let found = allItems.find((item)=>item.barcode===barcode);
    console.log(found);
    // return {barcode,name,unit,price,count}
    return {barcode,name:found.name,unit:found.unit,price:found.price,count}
  })
}

module.exports = {
  buildFormattedBarcode,
  buildCountedBarcode,
  buildCartBarcode
}
