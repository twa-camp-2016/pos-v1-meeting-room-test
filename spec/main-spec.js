'use strict';
let main = require('../main/main');
let {loadAllItems, loadPromotions} = require('./fixtures');

describe('pos', () => {

  it('#1.formatTags', () => {

    let tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2'
    ];

    let formattedTags = main.formatTags(tags);

    const expected = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2}
    ];


    expect(formattedTags).toEqual(expected);

  });

  it('#2.countBarcodes', () => {

    let formattedTags = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2}
    ];

    let countedBarcodes = main.countBarcodes(formattedTags);

    const expected = [

      {barcode: 'ITEM000001', count: 3},
      {barcode: 'ITEM000003', count: 2}
    ];

    expect(countedBarcodes).toEqual(expected);

  });
  it('#3.buildCartItems', () => {
    let countedBarcodes = [

      {barcode: 'ITEM000001', count: 3},
      {barcode: 'ITEM000003', count: 2}
    ];

    let allItems = loadAllItems();

    let cartItems = main.buildCartItems(countedBarcodes, allItems);

    const expectCartItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 3
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2
      }
    ];

    expect(cartItems).toEqual(expectCartItems);

  });


  xit('should print text', () => {

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
