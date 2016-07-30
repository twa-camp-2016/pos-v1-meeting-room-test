'use strict';
let tags = ['ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000003-2'];
function loadPromotions() {
  let promotions = [
    {type: 'BUY_TWO_GET_ONE_FREE', barcodes: ['ITEM000000', 'ITEM000001']},
    {type: 'OTHER_PROMOTION', barcodes: ['ITEM000003', 'ITEM000004']}];
  return promotions;
}
function loadAllItems() {
  let allItems = [{barcode: 'ITEM000000', name: '可口可乐', unit: '瓶', price: 3.00}
    {barcode:'ITEM000003',name:'羽毛球',unit:'个',price}];
  return allItems;
}
function getFormattedTags(tags) {
  let result = tags.map(tag=> {
    if (tag.includes('-')) {
      let [barcode,count]=tag.split('-');
      return {
        barcode: barcode, count: parseFloat(count)
      }
    } else {
      return {
        barcode: tag, count: 1
      }
    }
  });
  return result;
}
function getExitItemsByBarcode(array, barcode) {
  return array.find(n=>n.barcode === barcode);
}
function getCount(formattedTags) {
  return formattedTags.reduce((result, formattedTag) => {
    let found = getExitItemsByBarcode(result, formattedTag.barcode);
    if (found) {
      found.count += formattedTag.count;
    } else {
      result.push(formattedTag);
    }
    return result;
  }, []);
}
function printReceipt(tags) {
  let formattedTags = getFormattedTags(tags);
  let countBarcodes = getCount(formattedTags);
  let allItems = loadAllItems();
  let cartItems = getCartItems(allItems, countBarcodes);
  return cartItems;
}
console.log(printReceipt(tags));
module.exports = {getFormattedTags, getCount, loadAllItems, getCartItems}
