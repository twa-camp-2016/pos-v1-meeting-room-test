'use strict';
let {
  printReceipt,
  formatedItem,
  countBarcode,
  buildCartItems,
  buildPromotedItems,
} = require("../main/main.js");
let {loadAllItems, loadPromotions} = require("../spec/fixtures");

describe('pos', () => {
  it('#1', () => {
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
    let formattedItems = formatedItem(tags);

    let expected = [{barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 2}];

    expect(formattedItems).toEqual(expected);
  });

  it('#2', () => {
    const formattedItems = [{barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 2}];

    let countedBarcodes = countBarcode(formattedItems);

    let expected = [{barcode: 'ITEM000001', count: 5}, {barcode: 'ITEM000003', count: 2.5}, {
      barcode: 'ITEM000005',
      count: 3
    }];

    expect(countedBarcodes).toEqual(expected);
  });

  it('#3', () => {
    let countedBarcodes = [{barcode: 'ITEM000001', count: 5}, {
      barcode: 'ITEM000003',
      count: 2.5
    }, {barcode: 'ITEM000005', count: 3}];

    let allItems = loadAllItems();
    let cartItems = buildCartItems(countedBarcodes, allItems);

    let expected = [{barcode: 'ITEM000001', count: 5, name: '雪碧', unit: '瓶', price: 3.00},
      {barcode: 'ITEM000003', count: 2.5, name: '荔枝', unit: '斤', price: 15.00},
      {barcode: 'ITEM000005', count: 3, name: '方便面', unit: '袋', price: 4.50}];

    expect(cartItems).toEqual(expected);
  });

  it('#4', () => {
    let cartItems = [{barcode: 'ITEM000001', count: 5, name: '雪碧', unit: '瓶', price: 3.00},
                     {barcode: 'ITEM000003', count: 2.5, name: '荔枝', unit: '斤', price: 15.00},
                     {barcode: 'ITEM000005', count: 3, name: '方便面', unit: '袋', price: 4.50}];

    let promotions = loadPromotions();
    let promotedItems = buildPromotedItems(cartItems, promotions);

    let expected = [{barcode: 'ITEM000001', count: 5, name: '雪碧', unit: '瓶', price: 3.00,saved:3.00,payPrice:12.00},
      {barcode: 'ITEM000003', count: 2.5, name: '荔枝', unit: '斤', price: 15.00, saved:0, payPrice:37.50},
      {barcode: 'ITEM000005', count: 3, name: '方便面', unit: '袋', price: 4.50, saved:4.50, payPrice:9.00}];

     expect(promotedItems).toEqual(expected);

  });




  it('should print text', () => {

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

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});
