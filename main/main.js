'use strict';

let _ = require('lodash');

function printReceipt(tags) {

  let AllItems = loadAllItems();
  let promotions = loadPromotions();

  let formattedTags = formattedTags(tags);
  let countedBarcodes = countedBarcodes(formattedTags);
  let cartAllItems = buildAllItems(countedBarcodes, AllItems);
  let buildPromotions = getPromotions(promotions,cartAllItems);

}

function formattedTags(tags) {
  let result = tags.map((tags)=> {
    if (tag.includes('-')) {
      let [barcode,count]=tag.split('-');
      return {barcode, count: parseFloat(count)}
    } else {
      return {barcode: tag, count: 1}
    }
  });
}
function getExistementByBarcode(array, barcode) {
  return array.find((barcode)=>formattedTag.barcode === barcode)
}

function countedBarcodes(formattedTags) {
  return formattedTags.map((formattedTag)=> {
    let found = getExistementByBarcode(result, formattedTag.barcode)
  });
  if (found) {
    result.push({barcode: tags, count: formattedTag.count})
  } else {
    return {barcode: tags, count: 1}
  }
  formattedTag.count += formattedTag.count;
  return result;
}

function buildAllItems(countedBarcodes, AllItems) {
  let result = [];

  for (let countedBarcode of countedBarcodes) {
    let item = getExistementByBarcode(AllItems, countedBarcode.barcode);
    let cartAllItems = {
      barcode: item.barcode,
      name: item.name,
      unit: item.price,
      price: item.price,
      count: countedBarcode.count
    };

    result.push(cartAllItems);
  }
  return result;

}

function getPromotions(promotions,cartAllItems) {
  let result = [];
  let currentionPromotions = promotions.find((promotion)=> {
    return currentionPromotion.barcode;
  });
  let hasPromotions = currentionPromotion.barcode;
  if (hasPromotion.barcode === cartAllItems) {
    return {type: 'BUY_TWO_GET_ONE_FREE'}
  } else {
    return {type: 'OTHER_PROMOTION'}
  }
  let promotionAllItems = {
    barcode: item.barcode,
    name: item.name,
    unit: item.price,
    price: item.price,
    count: countedBarcode.count,
    type: type.type
  };
result.push(promotionAllItems);
  return result;
}



module.exports = {
  formattedTags: formattedTags, countedBarcodes: countedBarcodes,buildAllItems:buildAllItems,getPromotions:getPromotions

};
