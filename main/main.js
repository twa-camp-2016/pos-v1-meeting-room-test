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
function loadAllItems() {
  return [
    {
      barcode: 'ITEM000000',
      name: '可口可乐',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000002',
      name: '苹果',
      unit: '斤',
      price: 5.50
    },
    {
      barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15.00
    },
    {
      barcode: 'ITEM000004',
      name: '电池',
      unit: '个',
      price: 2.00
    },
    {
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50
    }
  ];
}

function loadpromotionItems() {
  return [
    {
      type: 'BUY_TWO_GET_ONE_FREE',
      barcodes: [
        'ITEM000000',
        'ITEM000001',
        'ITEM000005'
      ]
    }
  ];
}
function printReceipt(tags){
  let allItems = loadAllItems();
  let promotionItems = loadpromotionItems();
  let tagsItem = getTags(tags);
  //console.log(tagsItem);
  let countedTags = getCountedTags(tagsItem);
  // console.log(countedTags);
  let cartItems = getCartItems(countedTags, allItems);
  //console.log(cartItems);
  let promoteItems = getPromoteItems(cartItems, promotionItems);
//  console.log(promoteItems);
  let totalPrices = getTotalPrices(promoteItems );
 // console.log(totalPrices);
  let receipt=getReceiptItems(promoteItems, totalPrices);
  console.log(receipt);
  let receiptString=buildReceiptString(receipt);
 // console.log(receiptString);
}
printReceipt(tags);
function getTags(tags) {
  return tags.map((tag)=> {
    if (tag.includes('-')) {
      let [barcode,count]=tag.split("-");
      return {
        barcode,
        count: parseFloat(count)
      }
    } else {
      return {
        barcode: tag,
        count: 1
      }
    }
  });
}
function _existByBarcode(array, barcode) {
  return array.find((item)=>item.barcode === barcode);
}
function getCountedTags(tagsItem) {
  return tagsItem.reduce(((result, tag)=> {
    let temp = _existByBarcode(result, tag.barcode);

    if (temp) {
      temp.count += tag.count;
    } else {
      result.push(tag);
    }
    return result;
  }), []);
}
function getCartItems(countedTags, allItems) {
  return countedTags.map(({barcode, count})=> {
    let {name, unit, price}=_existByBarcode(allItems, barcode);
    return {barcode, count, name, unit, price};
  });
}
function getPromoteItems(cartItems, promotionItems) {
  return cartItems.map((item)=> {
    let temp = promotionItems.find(item=>item.type === 'BUY_TWO_GET_ONE_FREE');
    let hasPromoted = temp ? true : false;
    let payPrice = 0;
    let saved = 0;
    if (hasPromoted) {
      let savedCount = Math.floor(item.count / 3);
      saved = item.price * savedCount;
      payPrice = item.count * item.price - saved;
    }
    return {
      barcode: item.barcode,
      name: item.name,
      unit: item.unit,
      price: item.price,
      count: item.count,
      payPrice,
      saved}
  });
}
function getTotalPrices(promoteItems) {
  return promoteItems.reduce(((result,{payPrice,saved})=>{
    result.totalPay+=payPrice;
    result.totalSaved+=saved;
    return result;
  }),{totalPay:0,totalSaved:0});

}function getReceiptItems(promotionItems, totalPrices) {
    return {
      promotionItems,
      totalPay:totalPrices.totalPay,
      totalSaved: totalPrices.totalSaved
    }
}
function buildReceiptString(receipt) {
  let totalPay = receipt.totalPay;
  let saved = receipt.totalSaved;
  let receiptItemsString = "";
  let payPrice;
  for (let receiptItem of receipt.promotionItems) {

    receiptItemsString += `名称：${receiptItem.name},数量：${receiptItem.count}${receiptItem.unit},单价：${receiptItem.price.toFixed(2)}(元)，小计：${receiptItem.payPrice.toFixed(2)}(元)`;
    receiptItemsString += "\n";

  }
  const result = `****<没赚钱商店>收据***
${receiptItemsString}----------------------
总计:${totalPay.toFixed(2)}(元)
节省:${saved.toFixed(2)}(元)
**********************`;
  return result;
}
module.exports = {
  getTags: getTags,
  getCountedTags: getCountedTags,
  getCartItems: getCartItems,
  getPromoteItems: getPromoteItems,
  getTotalPrices:getTotalPrices,
  getReceiptItems:getReceiptItems,
  buildReceiptString:buildReceiptString,
  printReceipt:printReceipt
};
