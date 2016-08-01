'use strict';
let {getFormattedTags, getCountedItems, loadAllItems, buildCartItems, loadPromotions, buildPromotedItems, calculateTotalPrices,buildReceipt,buildReceiptString,printReceipt}=require('../main/main.js');
describe('pos', () => {

  it('should format tags', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2'
    ];

    let formattedTags = getFormattedTags(tags);

    const expectText = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 2}
    ];

    expect(formattedTags).toEqual(expectText);
  });
  it('should count items number', () => {

    const formattedTags = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 2}
    ];

    let countedItems = getCountedItems(formattedTags);

    const expectText = [
      {barcode: 'ITEM000001', count: 2},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 3}
    ];

    expect(countedItems).toEqual(expectText);
  });

  it('should build cart items', () => {

    let countedItems = [
      {barcode: 'ITEM000001', count: 2},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 3}
    ];
    let allItems = loadAllItems();
    let cartItems = buildCartItems(countedItems, allItems);

    const expectText = [
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
    ];

    expect(cartItems).toEqual(expectText);
  });
  it('should build promoted items', () => {

    let cartItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 6
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 3.5
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count: 2
      }
    ];
    let promotions = loadPromotions();
    let promotedItems = buildPromotedItems(cartItems, promotions);

    const expectText = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 6,
        payPrice: 12,
        saved: 6
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 3.5,
        payPrice: 52.5,
        saved: 0
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count: 2,
        payPrice: 9,
        saved: 0
      }
    ];

    expect(promotedItems).toEqual(expectText);
  });
  it('should calculate total prices', () => {

    let promotedItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 6,
        payPrice: 12,
        saved: 6
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 3.5,
        payPrice: 52.5,
        saved: 0
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count: 2,
        payPrice: 9,
        saved: 0
      }
    ];
    let totalPrices = calculateTotalPrices(promotedItems);

    const expectText = {totalPayPrice: 73.5, totalSaved: 6};

    expect(totalPrices).toEqual(expectText);
  });
  it('should build receipt', () => {

    let promotedItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 6,
        payPrice: 12,
        saved: 6
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 3.5,
        payPrice: 52.5,
        saved: 0
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count: 2,
        payPrice: 9,
        saved: 0
      }
    ];
    let totalPrices ={totalPayPrice: 73.5, totalSaved: 6};
    let receipt=buildReceipt(promotedItems,totalPrices);

    const expectText = {
      promotedItem: [{name: '雪碧', unit: '瓶', price: 3.00, count: 6,payPrice:12.00},
        {name: '荔枝', unit: '斤', price: 15, count: 3.50,payPrice:52.50},
        {name: '方便面', unit: '袋', price: 4.5, count: 2.00,payPrice:9.00}],
      totalPayPrice: 73.50,
      totalSaved: 6.00
    };

    expect(receipt).toEqual(expectText);
  });
  it('should build receipt string', () => {

    let receipt={
      promotedItem: [{name: '雪碧', unit: '瓶', price: 3.00, count: 6,payPrice:12.00},
        {name: '荔枝', unit: '斤', price: 15.00, count: 3.5,payPrice:52.50},
        {name: '方便面', unit: '袋', price: 4.50, count: 2,payPrice:9.00}],
      totalPayPrice: 73.50,
      totalSaved: 6.00
    };

    let receiptString=buildReceiptString(receipt);

    const expectText =`***<没钱赚商店>收据***
名称：雪碧，数量：6瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：3.5斤，单价：15.00(元)，小计：52.50(元)
名称：方便面，数量：2袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：73.50(元)
节省：6.00(元)
**********************`;
    require(`fs`).writeFileSync('3.txt',expectText);

    expect(receiptString).toEqual(expectText);
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
      'ITEM000005-2'
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

    require(`fs`).writeFileSync('2.txt',expectText);
    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});
