'use strict';
let {getFormattedTags, getCountBarcodes, buildCartItems, buildPromotedItems,
  calculateTotalPrices, buildReceipt, buildReceiptString, receipt}=require('../main/main.js');
let {loadAllItems, loadPromotions} = require('../spec/fixtures.js');
describe('pos', () => {
  it('should get formatted tags', () => {
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

    let result = getFormattedTags(tags);

    const expected = [ { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000003', count: 2.5 },
      { barcode: 'ITEM000005', count: 1 },
      { barcode: 'ITEM000005', count: 2 } ];

    expect(result).toEqual(expected);
  });

  it("should countedBarcodes", () => {
    const formattedTags = [
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000003', count: 2.5 },
      { barcode: 'ITEM000005', count: 1 },
      { barcode: 'ITEM000005', count: 2 } ];

    let result = getCountBarcodes(formattedTags);

    const expected = [
      {barcode: 'ITEM000001', count: 5},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 3}];

    expect(result).toEqual(expected);
  });

  it("should buildCartItems", () => {
    const countedBarcodes = [
      {barcode: 'ITEM000001', count: 5},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 3}];
    const allItems = loadAllItems();

    let result = buildCartItems(countedBarcodes, allItems);

    const expected = [
      { barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3, count: 5 },
      { barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15, count: 2.5 },
      { barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.5, count: 3 } ];

    expect(result).toEqual(expected);
  });

  it("should buildPromotedItems", () => {
    const cartItems = [
      { barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3, count: 5 },
      { barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15, count: 2.5 },
      { barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.5, count: 3 } ];
    const promotions = loadPromotions();

    let result = buildPromotedItems(cartItems, promotions);

    const expected = [
      { barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3, count: 5, payPrice: 12.00, saved: 3.00 },
      { barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15, count: 2.5, payPrice: 37.50, saved: 0.00  },
      { barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.5, count: 3, payPrice: 9.00, saved: 4.50  } ];

    expect(result).toEqual(expected);
  });

  it("should calculateTotalPrices", () => {
    const promotedItems = [
      { barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3, count: 5, payPrice: 12.00, saved: 3.00 },
      { barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15, count: 2.5, payPrice: 37.50, saved: 0.00  },
      { barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.5, count: 3, payPrice: 9.00, saved: 4.50  } ];

    let result = calculateTotalPrices(promotedItems);

    const expected = { totalPayPrice: 58.5, totalSaved: 7.5 };

    expect(result).toEqual(expected);
  });

  it("should buildReceipt", () => {
    const promotedItems = [
      { barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3, count: 5, payPrice: 12.00, saved: 3.00 },
      { barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15, count: 2.5, payPrice: 37.50, saved: 0.00  },
      { barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.5, count: 3, payPrice: 9.00, saved: 4.50  } ];
    const totalPrice = { totalPayPrice: 58.5, totalSaved: 7.5 };

    let result = buildReceipt(promotedItems, totalPrice);

    const expected = {
      promotedItems: [
        { name: '雪碧', unit: '瓶', price: 3, count: 5, payPrice: 12.00, saved: 3.00 },
        { name: '荔枝', unit: '斤', price: 15, count: 2.5, payPrice: 37.50, saved: 0.00  },
        { name: '方便面', unit: '袋', price: 4.5, count: 3, payPrice: 9.00, saved: 4.50  } ],
      savedItems: [
        { name: '雪碧', count: 5, unit: '瓶' },
        { name: '方便面', count: 3, unit: '袋' }],
      totalPayPrice: 58.5,
      totalSaved: 7.5
    };
    expect(result).toEqual(expected);
  });

  it("should buildReceipt", () => {
    const receiptModel = {
      promotedItems: [
        { name: '雪碧', unit: '瓶', price: 3, count: 5, payPrice: 12.00, saved: 3.00 },
        { name: '荔枝', unit: '斤', price: 15, count: 2.5, payPrice: 37.50, saved: 0.00  },
        { name: '方便面', unit: '袋', price: 4.5, count: 3, payPrice: 9.00, saved: 4.50  } ],
      savedItems: [
        { name: '雪碧', count: 5, unit: '瓶' },
        { name: '方便面', count: 3, unit: '袋' }],
      totalPayPrice: 58.5,
      totalSaved: 7.50
    };

    let result = buildReceiptString(receiptModel);

    const expected = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;
    expect(result).toEqual(expected);
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
    receipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;
    //require(`fs`).writeFileSync('2.txt', expectText);
    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});
