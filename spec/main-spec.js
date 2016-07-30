'use strict';
let {printReceipt,buildCartItems, buildReceiptItems,buildReceipt} = require('../main/main.js');

describe('pos', () => {

  it('统计商品信息', () => {
    const input = ['ITEM000005-2'];
    const allItems = [{
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
      }];
    const expectResult = buildCartItems(input, allItems);
    const result = [{
      item: {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50
      }, count: 2
    }];

    expect(expectResult).toEqual(result);
  });

  it('统计小计', () => {
    const promotions = [
      {
        type: 'BUY_TWO_GET_ONE_FREE',
        barcodes: [
          'ITEM000000',
          'ITEM000001',
          'ITEM000005'
        ]
      }
    ];
    const input = [{
      item: {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50
      }, count: 2
    }];
    const result = [{
      cartItem: {
        item: {
          barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.50
        }, count: 2
      }, subtotal: 9,
        saved:4.5
    }];
    const expectResult = buildReceiptItems(input, promotions);

    expect(expectResult).toEqual(result);
  });
  it('统计小计', () => {

    const input =  [{
      cartItem: {
        item: {
          barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.50
        }, count: 2
      }, subtotal: 9,
      saved:4.50
    }];
    const result = {receiptItem: [{
      cartItem: {
        item: {
          barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.50
        }, count: 2
      }, subtotal: 9,saved:4.50
    }],total:9,totalSaved:4.50};
    const expectResult = buildReceipt(input);

    expect(expectResult).toEqual(result);
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
