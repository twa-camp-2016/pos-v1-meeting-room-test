'use strict';
let {getFormattedTags, getCountBarcodes, buildCartItems, loadAllItems, loadPromotions, buildPromotedItems}=require('../main/main.js');
//let {loadAllItems}=require('../spec/fixtures.js');
describe('pos', () => {
  fit('should get formatted tags', () => {
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

  fit("should countedBarcodes", () => {
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

  fit("should buildCartItems", () => {
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

  fit("should buildPromotedItems", () => {
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
