'use strict';
let {getTags, getCountedTags, getCartItems, getPromoteItems,getTotalPrices,getReceiptItems,buildReceiptString,printReceipt}=require("../main/main.js");
describe('pos', () => {
  it(("getTags"), ()=> {
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
    let tagsItems = getTags(tags);
    const expectText = [{barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2.5},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 2}];
    expect(tagsItems).toEqual(expectText);
  });
  it(("getCountedTags"), ()=> {
      let formatTags = [{barcode: 'ITEM000001', count: 1},
        {barcode: 'ITEM000001', count: 1},
        {barcode: 'ITEM000001', count: 1},
        {barcode: 'ITEM000001', count: 1},
        {barcode: 'ITEM000001', count: 1},
        {barcode: 'ITEM000003', count: 2.5},
        {barcode: 'ITEM000005', count: 1},
        {barcode: 'ITEM000005', count: 2}];
      let countedTags = getCountedTags(formatTags);
      const expectText = [{barcode: 'ITEM000001', count: 5},
        {barcode: 'ITEM000003', count: 2.5},
        {barcode: 'ITEM000005', count: 3}];
      expect(countedTags).toEqual(expectText);

    }
  );
  it(("getCartItems"), ()=> {
      let countedTags = [{barcode: 'ITEM000001', count: 5},
        {barcode: 'ITEM000003', count: 2.5},
        {barcode: 'ITEM000005', count: 3}];
      let allItems = [
        {
          barcode: 'ITEM000000',
          name: '可口可乐',
          unit: '瓶',
          price: 3.00
        },
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00
        },
        {
          barcode: 'ITEM000002',
          name: '苹果',
          unit: '斤',
          price: 5.50
        },
        {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00
        },
        {
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
        }
      ];
      let cartItems = getCartItems(countedTags, allItems);
      const expectText = [{
        barcode: 'ITEM000001',
        count: 5,
        name: '雪碧',
        unit: '瓶',
        price: 3
      },
        {
          barcode: 'ITEM000003',
          count: 2.5,
          name: '荔枝',
          unit: '斤',
          price: 15
        },
        {
          barcode: 'ITEM000005',
          count: 3,
          name: '方便面',
          unit: '袋',
          price: 4.5
        }];
      expect(cartItems).toEqual(expectText);

    }
  );
  it(("getPromotionItems"), ()=> {
      let cartItems = [{
        barcode: 'ITEM000001',
        count: 5,
        name: '雪碧',
        unit: '瓶',
        price: 3
      },
        {
          barcode: 'ITEM000003',
          count: 2.5,
          name: '荔枝',
          unit: '斤',
          price: 15
        },
        {
          barcode: 'ITEM000005',
          count: 3,
          name: '方便面',
          unit: '袋',
          price: 4.5
        }];
      let promotions=
      [
        {
          type: 'BUY_TWO_GET_ONE_FREE',
          barcodes: [
            'ITEM000000',
            'ITEM000001',
            'ITEM000005'
          ]
        }
      ];
      let promoteItems = getPromoteItems(cartItems, promotions);
      const expectText =
        [ { barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3,
          count: 5,
          payPrice: 12,
          saved: 3 },
          { barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15,
            count: 2.5,
            payPrice: 37.5,
            saved: 0 },
          { barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.5,
            count: 3,
            payPrice: 9,
            saved: 4.5 } ];
      expect(promoteItems).toEqual(expectText);

    }
  );
  it(("getTotalPrices"),()=>{
    let promotionItems=
      [ { barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3,
        count: 5,
        payPrice: 12,
        saved: 3 },
        { barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15,
          count: 2.5,
          payPrice: 37.5,
          saved: 0 },
        { barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.5,
          count: 3,
          payPrice: 9,
          saved: 4.5 } ];
    let totalPrices=getTotalPrices(promotionItems);
    const expectText={ totalPay: 58.5, totalSaved: 7.5 };
    expect(totalPrices).toEqual(expectText);
  });
  it(("getReceiptItems"),()=>{
    let promoteItems= [[{
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3,
      count: 5,
      payPrice: 12,
      saved: 3
    }],
      [{
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15,
        count: 2.5,
        payPrice: 37.5,
        saved: 0
      }],
      [{
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.5,
        count: 3,
        payPrice: 9,
        saved: 4.5
      }]];
    let totalPrices={ totalPay: 58.5, totalSaved: 7.5 };
    let receipt=getReceiptItems(promoteItems, totalPrices);
    const expectText={ promotionItems:
      [ { barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3,
        count: 5,
        payPrice: 12,
        saved: 3 },
        { barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15,
          count: 2.5,
          payPrice: 37.5,
          saved: 0 },
        { barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.5,
          count: 3,
          payPrice: 9,
          saved: 4.5 } ],
      totalPay: 58.5,
      totalSaved: 7.5 };
    expect(totalPrices).toEqual(expectText);
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
