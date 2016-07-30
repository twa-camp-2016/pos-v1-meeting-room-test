'use strict';
let {formatTags,countTags,getCartItems,getPromotionItems,getTotalprice,getReceipt,getReceiptString} = require('../main/main.js')

describe('pos', () => {

  it('should get formatted tags',() => {
    let tags = ['ITEM000001', 'ITEM000002-3'];
    let formattedTags = formatTags(tags);
    let expected = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000002', count: 3}
    ];
    expect(formattedTags).toEqual(expected);
  });
  it('should get countTags',() =>{
    let input = [{barcode: 'ITEM000001', count: 1}, {barcode: 'ITEM000002', count: 3}, {barcode: 'ITEM000001', count: 3}];
    let output = countTags(input);
    let expected = [{barcode: 'ITEM000001', count: 4}, {barcode: 'ITEM000002', count: 3}];
    expect(output).toEqual(expected);
  })
  it('should get cartTags',() =>{
    let allItems = loadAllItems();
    let countedBarcodes = [{barcode: 'ITEM000000', count: 2}, {barcode: 'ITEM000001', count: 3}];
    let cartItems = getCartItems(countedBarcodes, loadAllItems());
    let expected = [{barcode: 'ITEM000000', name: '可口可乐', unit: '瓶', price: 3.00, count: 2},
      {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 3}];
    expect(cartItems).toEqual(expected);
  });
  it('should get promotionItems',() =>{
   let input = [{barcode: 'ITEM000000', name: '可口可乐', unit: '瓶', price: 3.00, count: 2},
     {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 3}];
   let output = getPromotionItems(input,loadPromotions());
    let expected = [{barcode: 'ITEM000000', name: '可口可乐', unit: '瓶', price: 3.00, count: 2,payprice:6.00,saved:0},
      {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 3,payprice:6.00,saved:3}];
  })
  it('should get getTotalprice',() => {
    let input = [{barcode: 'ITEM000000', name: '可口可乐', unit: '瓶', price: 3.00, count: 2,payprice:6.00,saved:0},
      {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 3,payprice:6.00,saved:3}];
    let output = getTotalprice(input);
    let expected = {
      totalpayprice: 12.00,
      totalsaved: 3
    };
    expect(output).toEqual(expected);
  });
  it('should get receipt',()=>{
    let input1 = [{barcode: 'ITEM000000', name: '可口可乐', unit: '瓶', price: 3.00, count: 2,payprice:6.00,saved:0},
      {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 3,payprice:6.00,saved:3}];
      let input2 =  {
        totalpayprice: 12.00,
        totalsaved: 3
      };
    let output = getReceipt(input1,input2);
    let expected = {
      receiptItems: [
        { name: '可口可乐', unit: '瓶', price: 3.00, count: 2,payprice:6.00,saved:0},
        { name: '雪碧', unit: '瓶', price: 3.00, count: 3,payprice:6.00,saved:3}
      ],
      totalpayprice: 12.00,
      totalsaved: 3
    };
    expect(output).toEqual(expected);
  })
  it('should get receiptString',() =>{
    let input = {
      receiptItems: [
        { name: '可口可乐', unit: '瓶', price: 3.00, count: 2,payprice:6.00,saved:0},
        { name: '雪碧', unit: '瓶', price: 3.00, count: 3,payprice:6.00,saved:3}
      ],
      totalpayprice: 12.00,
      totalsaved: 3
    };
    let output = getReceiptString(input);
    let expected = `***<没钱赚商店>收据***
名称：可口可乐，数量：2瓶，单价：3.00(元)，小计：6.00(元)
名称：雪碧，数量：3瓶，单价：3.00(元)，小计：6.00(元)
----------------------
总计：12.00(元)
节省：3.00(元)
**********************`;
    expect(output).toEqual(expected);
  })
//  it('should print text', () => {
//
//    const tags = [
//      'ITEM000001',
//      'ITEM000001',
//      'ITEM000001',
//      'ITEM000001',
//      'ITEM000001',
//      'ITEM000003-2.5',
//      'ITEM000005',
//      'ITEM000005-2',
//    ];
//
//    spyOn(console, 'log');
//
//    printReceipt(tags);
//
//    const expectText = `***<没钱赚商店>收据***
//名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
//名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
//名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
//----------------------
//总计：58.50(元)
//节省：7.50(元)
//**********************`;
//
//    expect(console.log).toHaveBeenCalledWith(expectText);
//  });
});
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

function loadPromotions() {
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
