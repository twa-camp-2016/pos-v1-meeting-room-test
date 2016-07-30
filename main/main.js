'use strict';

//TODO: 请在该文件中实现练习要求并删除此注释
let _ = require('lodash');
let tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];
function formatCartCount(tags) {
  let a = _.chain(tags)
    .map(x=> {
      if (x.includes('-')) {
        return {barcode: x.split('-')[0], count: parseFloat(x.split('-')[1])}
      } else
        return {barcode: x, count: 1}
    })
    .value();
  //console.log(a);
  return a;
}
function _getElementById(array, barcode) {
  return array.find((element)=>element.barcode === barcode);
}

function getCartCounts(formattedCounts) {

  let b = formattedCounts.reduce((result, formattedTag)=> {
    let found = _getElementById(result, formattedTag.barcode);
    //console.log(result);
    //console.log(formattedTag);
    //console.log(found);
    if (found) {
      found.count += formattedTag.count;
    } else {
      result.push(formattedTag);
    }
    return result;
  }, []);
  return b;
//console.log(b);
}
function loadAllItems() {
  return [
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15.00
    },
    {
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50
    }];
}
function buildAllItems(cartCount,allItems){
  let a=_.chain(cartCount)
    .map(x=>{
      let found=_getElementById(allItems, x.barcode)
      if(found)
      {
        return {barcode:x.barcode,name:found.name,count:x.count,unit:found.unit,price:found.price,}
      }
    })
    .value();
return a;
  //console.log(a);
}
function promotionItems(){
  return [
    {
      type: 'BUY_TWO_GET_ONE_FREE',
      barcodes: [
        'ITEM000000',
        'ITEM000001'
      ]
    },
    {
      type: 'OTHER_PROMOTION',
      barcodes: [
        'ITEM000003',
        'ITEM000004'
      ]
    }
  ];
}


function builtPromotedItems(builtedCartItems,promottedItems){
  let currentPromotion=_.find(promottedItems,(promotion)=>promotion.type==='BUY_TWO_GET_ONE_FREE');
  let a= _.map(builtedCartItems,(cartItems)=> {
    let hasPromoted = currentPromotion.barcodes.includes(cartItems.barcode);
    let saveCount = Math.floor(cartItems.count / 3);
    //let savePrice=saveCount*cartItems.price;
    let totalPrice = cartItems.count * cartItems.price;
    let savePrice = hasPromoted ? cartItems.price * saveCount : 0;
    let payPrice = totalPrice - savePrice;
    //console.log(_fixPrice(savePrice));
    // console.log(payPrice);
    //console.log(Object.assign({}, cartItems, {payPrices: payPrice, savePrices: savePrice}));
    return _.assign({}, cartItems, {payPrices: payPrice, savePrices: savePrice});
  });
  let result=[];
  for(let element of a)
  {
    result.push(element);
  }
return result;
//console.log(result);
}

function calculateTotalPrice(builtedPromtedItems){
  let a= _.reduce(builtedPromtedItems,(result,{payPrices,savePrices})=>
    {
      result.totalPayPrice+=payPrices;
      result.totalSavePrice+=savePrices;
      return result;
    },{totalPayPrice:0,totalSavePrice:0}
  );
  //console.log(a);
  return a;
}
function builtReceipt(builtedPromtedItems,calculateItems) {
  let a= {
    promotedItems: _.map(builtedPromtedItems,({name, unit, price, count, payPrices, savePrices})=> {
      return {name, unit, price, count, payPrices, savePrices};
    }),
    totalPayPrice:calculateItems.totalPayPrice,
    totalSavePrice:calculateItems.totalSavePrice
  };
  //console.log(a);
  return a;
}

function builtNotes(buildReceipt){
  let lines=['***<没钱赚商店>收据***'];
  for(let item of buildReceipt.promotedItems)
  {
    lines.push(`名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price}(元)小计：${item.payPrices}`)
  }

}



function Receipt(tags) {
  let formattedCounts = formatCartCount(tags);
  let cartCount = getCartCounts(formattedCounts);
  let allItems=loadAllItems();
  let builtedCartItems=buildAllItems(cartCount,allItems);
  let promottedItems=promotionItems();
  let builtedPromtedItems=builtPromotedItems(builtedCartItems,promottedItems);
  let calculateItems=calculateTotalPrice(builtedPromtedItems);
  let buildReceipt=builtReceipt(builtedPromtedItems,calculateItems)
}

Receipt(tags);

module.exports = {
  formatCartCount: formatCartCount,
  getCartCounts: getCartCounts,
  loadAllItems:loadAllItems,
  buildAllItems:buildAllItems,
  promotionItems:promotionItems,
  builtPromotedItems:builtPromotedItems,
  calculateTotalPrice:calculateTotalPrice,
  builtReceipt:builtReceipt
};



