'use strict';
let {
  printReceipt,
  getCartItems,
  getReceiptItems,
  getTotalItems
} = require('../main/main');

let {
  loadAllItems,
  loadPromotions
} = require('../spec/fixtures');
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

  it('获得商品信息', () => {
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
    const allItems = loadAllItems();
    const cartItems = getCartItems(tags, allItems);

    const expectText = [
      {
        item: {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00
        },
        count: 5
      },
      {
        item: {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00
        },
        count: 2.5
      },
      {
        item: {
          barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.50
        },
        count: 3
      }
    ];

    expect(cartItems).toEqual(expectText);
  });

  it('获得小计和优惠', () => {
    const cartItems = [
      {
        item: {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00
        },
        count: 5
      },
      {
        item: {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00
        },
        count: 2.5
      },
      {
        item: {
          barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.50
        },
        count: 3
      }
    ];
    const allPromotions = loadPromotions();
    const receiptItems = getReceiptItems(cartItems, allPromotions);

    const expectText = [
      {
        cartItem: {
          item: {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
          },
          count: 5
        },
        subtotal: 12.00,
        save: 3.00
      },
      {
        cartItem:{

        item: {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00
        },
        count: 2.5
        },
        subtotal:37.50,
        save:0
      },
      {
        cartItem:{
          item: {
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
          },
          count: 3
        },
        subtotal:9.00,
        save:4.5
      }
    ];
    expect(receiptItems).toEqual(expectText);
  });

  it('获得总计和节省',() => {
    const receiptItems = [
      {
        cartItem: {
          item: {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
          },
          count: 5
        },
        subtotal: 12.00,
        save: 3.00
      },
      {
        cartItem:{

          item: {
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
          },
          count: 2.5
        },
        subtotal:37.50,
        save:0
      },
      {
        cartItem:{
          item: {
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
          },
          count: 3
        },
        subtotal:9.00,
        save:4.5
      }
    ];
    const totalSaves = getTotalItems(receiptItems);

    const expectText = {total:58.50,saves:7.50};
    expect(totalSaves).toEqual(expectText);
  });

  it('获得小票',())
});
