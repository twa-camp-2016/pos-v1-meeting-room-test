'use strict';
let {
  buildFormattedBarcode,
  buildCountedBarcode,
  buildCartBarcode,
  buildPromotionItems,
  buildTotalItems,
  buildReceipt,
  printReceipt
}=require('../main/main');
let {loadAllItems, loadPromotions} = require('./fixtures');

describe('pos', () => {

  it('buildFormattedBarcode', function () {
    let input =
      [
        'ITEM000001',
        'ITEM000003-2'
      ];
    let result = buildFormattedBarcode(input);
    let expectItem = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2}
    ];
    expect(result).toEqual(expectItem);
  });

  it('buildCountedBarcode', function () {
    let input = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2},
    ];
    let result = buildCountedBarcode(input);
    let expectItem = [
      {barcode: 'ITEM000001', count: 2},
      {barcode: 'ITEM000003', count: 2}
    ];
    expect(result).toEqual(expectItem);
  });

  it('buildCartedBarcode', function () {
    let input = [
      {barcode: 'ITEM000003', count: 2},
      {barcode: 'ITEM000005', count: 3},
    ];
    let allItems = loadAllItems();
    let result = buildCartBarcode(input, allItems);
    let expectItem = [
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count: 3
      }
    ];
    expect(result).toEqual(expectItem);
  });


  it('buildPromotionItems', function () {
    let input = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2
      }
    ]
    let promotions = loadPromotions();
    let result = buildPromotionItems(input, promotions);
    let expectItem = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5,
        save: 3,
        payPrice: 12
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2,
        save: 0,
        payPrice: 30
      }
    ];
    expect(result).toEqual(expectItem);
  });


  it('buildTotalItems', function () {
    let input = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5,
        save: 6,
        payPrice: 9
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2,
        save: 0,
        payPrice: 30
      }
    ];
    let result = buildTotalItems(input);
    let expectItem = {totalSaved: 6, totalPrice: 39};
    expect(result).toEqual(expectItem);
  });


  it('buildReceipt', function () {
    let total = {totalSaved: 6, totalPrice: 39};
    let input = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5,
        saved: 6,
        payPrice: 9
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2,
        saved: 0,
        payPrice: 30
      }
    ];
    let result = buildReceipt(input, total);
    let expectItem = {
      receiptItems: [
        {
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          count: 5,
          saved: 6,
          payPrice: 9
        },
        {
          name: '荔枝',
          unit: '斤',
          price: 15.00,
          count: 2,
          saved: 0,
          payPrice: 30
        }
      ],
      totalPrice: 39,
      totalSaved: 6
    };
    expect(result).toEqual(expectItem);
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
