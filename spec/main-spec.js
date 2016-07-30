'use strict';
let {
  getFormatedTags,
  getCountTags,
  getCartItems,
  getPromotionItems,
  calulateTotalPrice,
  buildReceipt
} = require('../main/main');

let {
  loadAllItems,
  loadPromotions
} = require('../spec/fixtures');

describe('pos unit', ()=> {
  it('getFormatedTags', ()=> {
    let tags = [
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2'
    ];
    let formatedTags = [
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 2}
    ];
    let result = getFormatedTags(tags);
    expect(formatedTags).toEqual(result);
  });

  it('getCountTags', ()=> {
    let formatedTags = [
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000001', count: 2}
    ];

    let countTags = [
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 3},
      {barcode: 'ITEM000001', count: 2}
    ];
    let result = getCountTags(formatedTags);
    expect(countTags).toEqual(result);
  });

  it('getCartItems', ()=> {
    let countTags = [
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 3},
      {barcode: 'ITEM000001', count: 2}
    ];
    let cartItems = [
      {barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15.00, count: 2.5},
      {barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.50, count: 3},
      {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 2}
    ];
    let allItems = loadAllItems();
    let result = getCartItems(allItems, countTags);
    expect(cartItems).toEqual(result);
  });

  it('getCartItems', ()=> {
    let cartItems = [
      {barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15.00, count: 2.5},
      {barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.50, count: 3},
      {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 2}
    ];

    let promotedItems = [
      {barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15.00, count: 2.5, payPrice: 37.5, saved: 0},
      {barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.50, count: 3, payPrice: 9, saved: 4.50},
      {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 2, payPrice: 6, saved: 0}
    ];
    let promotions = loadPromotions();
    let result = getPromotionItems(promotions, cartItems);
    expect(promotedItems).toEqual(result);
  });

  it('calulateTotalPrice', ()=> {
    let promotedItems = [
      {barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15.00, count: 2.5, payPrice: 37.5, saved: 0},
      {barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.50, count: 3, payPrice: 9, saved: 4.50},
      {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 2, payPrice: 6, saved: 0}
    ];
    let totalPriceAndsaved = {
      totalPrice: 52.5,
      totalSaved: 4.5
    }
    let result = calulateTotalPrice(promotedItems);
    expect(totalPriceAndsaved).toEqual(result);
  });

  it('buildReceipt', ()=> {
    let promotedItems = [
      {barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15.00, count: 2.5, payPrice: 37.5, saved: 0},
      {barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.50, count: 3, payPrice: 9, saved: 4.50},
      {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 2, payPrice: 6, saved: 0}
    ];

    let totalPriceAndsaved = {
      totalPrice: 52.5,
      totalSaved: 4.5
    }

    let receipt = {
      items: [
        {barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15.00, count: 2.5, payPrice: 37.5, saved: 0},
        {barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.50, count: 3, payPrice: 9, saved: 4.50},
        {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 2, payPrice: 6, saved: 0}
      ],
      totalPrice: 52.5,
      totalSaved: 4.5
    }

    let result = buildReceipt(promotedItems,totalPriceAndsaved);
    expect(receipt).toEqual(result);
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

