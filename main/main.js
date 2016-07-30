'use strict';
let _ = require("lodash");
let {loadAllItems, loadPromotions} = require("../spec/fixtures");

function printReceipt(tags) {
  let formattedItems = formatedItem(tags);
  let countedBarcodes = countBarcode(formattedItems);
  let allItems = loadAllItems();
  let cartItems = buildCartItems(countedBarcodes, allItems);
  let promotions = loadPromotions();
  let promotedItems = buildPromotedItems(cartItems, promotions);

  let totalPrices = calculateTotalPrice(promotedItems);
  let receipt = buildReceipt(promotedItems,totalPrices);
  let receiptString = buildReceiptString(receipt);
  return receiptString;
}

function formatedItem(tags) {
  return _.map((tags), tag => {
    if (tag.includes('-')) {
      let [barcode,count] = tag.split("-");
      return {barcode, count: parseFloat(count)}
    } else {
      return {barcode: tag, count: 1}
    }
  });
}

function _getExistElementByItem(array, barcode) {
  return _.find((array), element => element.barcode === barcode);
}

function countBarcode(formattedItems) {

  return _.reduce(formattedItems, (result, formattedItem) => {
    let found = _getExistElementByItem(result, formattedItem.barcode);
    if (found) {
      found.count += formattedItem.count;
    } else {
      result.push(formattedItem);
    }
    return result;
  }, []);
}
function buildCartItems(countedBarcodes, allItems) {
  return _.map((countedBarcodes), ({barcode, count})=> {
    let {name, price, unit} = _getExistElementByItem(allItems, barcode);
    return {name, price, unit, barcode, count}
  });
}
function buildPromotedItems(cartItems, promotions) {
  let currentpromotion = promotions.find((promotion) =>promotion.type === 'BUY_TWO_GET_ONE_FREE');
  return _.map((cartItems), cartItem => {
    let hasPromoted = currentpromotion.barcodes.includes(cartItem.barcode) && cartItem.count >= 3;
    let totalPrice = cartItem.price * cartItem.count;
    let saved = hasPromoted ? parseInt(cartItem.count / 3) * cartItem.price : 0;
    let payPrice = totalPrice - saved;
    return Object.assign({}, cartItem, {payPrice, saved});
  });
}

function calculateTotalPrice(promotedItems) {
  return _.reduce(promotedItems, (result, {payPrice, saved}) => {
    result.totalPrice += payPrice;
    result.totalSaved += saved;
    return result;
  }, {totalPrice: 0, totalSaved: 0});
}
function buildReceipt(promotedItems,{totalPrice,totalSaved}) {
      return{
           promotedItems:promotedItems.map(({barcode,name,unit,price,count,payPrice,saved}) =>{
             return {barcode,name,unit,price,count,payPrice,saved}
           }),
           totalPrice,totalSaved
      }
}
function buildReceiptString(receipt) {
       let lines = ["***<没钱赚商店>收据***"];

       for(let {name,price,count,payPrice,unit} of receipt.promotedItems){
           let line = `名称：${name}，数量：${count}${unit}，单价：${price.toFixed(2)}(元)，小计：${payPrice.toFixed(2)}(元)`;
           lines.push(line);
       }

      lines.push('----------------------');
      lines.push(`总计：${receipt.totalPrice.toFixed(2)}(元)`);
      lines.push(`节省：${receipt.totalSaved.toFixed(2)}(元)`);
      lines.push('**********************');
      let lin = lines.join('\n');
      return lin;
}

module.exports = {
  printReceipt: printReceipt,
  formatedItem: formatedItem,
  countBarcode: countBarcode,
  buildCartItems: buildCartItems,
  buildPromotedItems: buildPromotedItems,
  calculateTotalPrice: calculateTotalPrice,
  buildReceipt:   buildReceipt,
  buildReceiptString: buildReceiptString
}
