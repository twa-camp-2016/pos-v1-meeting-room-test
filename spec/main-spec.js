'use strict';
let {getFormattedItems,getCountBarcodes,buildCartItems, buildPromotedItems,printReceipt} = require('../main/main');
let {loadAllItems,loadPromotions} = require('./fixtures')
describe('pos', () => {
  it('getFormattedItems', () => {
    let tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2'
    ];
    let formattedItems = getFormattedItems(tags);
    let expected = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 2}
    ]
    expect(formattedItems).toEqual(expected);
  });
  it('getCountBarcode', () => {
    let formattedItems =[
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 2}
    ];
    let countBarcodes = getCountBarcodes(formattedItems);
    let expected = [
      {barcode: 'ITEM000001', count: 2},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 3},
    ]
    expect(countBarcodes).toEqual(expected);
  });
  it('buildCartItems', () => {
    let countBarcodes = [
      {barcode: 'ITEM000001', count: 2},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 3}
    ]
    let allItems = loadAllItems();
    let cartItems = buildCartItems(countBarcodes,allItems);
    let expected = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 2
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2.5
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count: 3
      }
    ]
    expect(cartItems).toEqual(expected);
  });
  it('buildPromotions', () => {
    let cartItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 2
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2.5
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count: 3
      }
    ]
    let promotions = loadPromotions();
    let promotedItems = buildPromotedItems(cartItems,promotions);
    let excepted = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 2,
        payPrice: 6,
        saved: 0
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2.5,
        payPrice: 37.5,
        saved: 0
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count: 3,
        payPrice: 9,
        saved: 4.5
      }
    ]
    expect(promotedItems).toEqual(excepted);
  })

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
