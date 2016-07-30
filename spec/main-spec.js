'use strict';
let {formattedTags, countedBarcodes,buildAllItems} =require("../main/main.js");

describe('pos', () => {
  fit('#1should formattedTags', () => {
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
    let formattedTags = formattedTags(tags);
    let expectText = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 2}
    ];
    expect(formattedTags).toHaveBeenCalledWith(expectText);
  });
});

describe('pos', () => {
  fit('#2CcountedBarcodes', () => {
    let formattedTags = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 2}
    ];
    let countedBarcodes = countedBarcodes(formattedTags);
    let expectText = [
      {barcode: 'ITEM000001', count: 4},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 3},
    ];
    expect(countedBarcodes).toHaveBeenCalledWith(expectText);
  });
});
ddescribe('buildAllItems', () => {
  it('#buildAllItems', () => {
    let countedBarcodes =[
      {barcode: 'ITEM000001', count: 4},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 3},

    ];
    let AllItems= loadAllItems();
    let cartAllItems = buildAllItems(countedBarcodes,AllItems);
    let expectText = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 4
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
    ];
    expect(cartAllItems).toHaveBeenCalledWith(expectText);
  });
});


describe('buildPromotions', () => {
  it('#buildPromotions', () => {

    let cartAllItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 4
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
    ];

    let promotions = loadPromotions();
    let buildPromotions = getPromotions(promotions,cartAllItems)
    let promotionsItems=
      [{
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 4,
        type: 'BUY_TWO_GET_ONE_FREE',
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2.5,
        type:'OTHER_PROMOTION'
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count: 3,
        type:'BUY_TWO_GET_ONE_FREE'
      }
    ];


    expect(promotionsItems).toHaveBeenCalledWith(expectText);
  });
});



















describe('pos', () => {
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
