'use strict';
/*global describe, it ,expect*/
let {formattedTags,countItems,buildCartItems,buildPromotedItems,calculateTotalPrices,buildReceipt} = require('../main/main.js');
let {loadAllItems,loadPromotions} = require('../spec/fixtures.js');
describe('pos', () => {
  'use strict';

  function loadAllItems() {
    return [
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
  }

  function loadPromotions() {
    return [
      {
        type: 'BUY_TWO_GET_ONE_FREE',
        barcodes: [
          'ITEM000000',
          'ITEM000001',
          'ITEM000005'
        ]
      }
    ];
  }

  describe('pos', () => {

    it('#1 格式化数据', () => {

      let tags = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000003-2'
      ];
      let formattedTag = formattedTags(tags);
      let expectFormattedTags = [
        {barcode: 'ITEM000001', count: 1},
        {barcode: 'ITEM000001', count: 1},
        {barcode: 'ITEM000001', count: 1},
        {barcode: 'ITEM000003', count: 2}
      ];
      expect(formattedTag).toEqual(expectFormattedTags);

    });

    it('#2.各商品计数', () => {

      let formattedTags = [
        {barcode: 'ITEM000001', count: 1},
        {barcode: 'ITEM000001', count: 1},
        {barcode: 'ITEM000001', count: 1},
        {barcode: 'ITEM000003', count: 2}
      ];

      let countedBarcodes = countItems(formattedTags);

      let expectFormattedTags = [

        {barcode: 'ITEM000001', count: 3},
        {barcode: 'ITEM000003', count: 2}
      ];

      expect(countedBarcodes).toEqual(expectFormattedTags);

    });

    it('#3.商品明细', () => {
      let countedBarcodes = [

        {barcode: 'ITEM000001', count: 3},
        {barcode: 'ITEM000003', count: 2}
      ];

      let allItems = loadAllItems();

      let cartItems = buildCartItems(countedBarcodes, allItems);

      let expectCartItems = [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          count: 3,
          payPrice:9.00
        },
        {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00,
          count: 2,
          payPrice:30.00
        }
      ];
      expect(cartItems).toEqual(expectCartItems);

    });
    it('#4 优惠后商品信息', () => {
      let cartItems = [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          count: 3,
          payPrice:9.00
        },
        {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00,
          count: 2,
          payPrice:30.00
        }
      ];
      let promotions = loadPromotions();
      var promotedItems = buildPromotedItems(cartItems, promotions);
      let expectPromotedItems = [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          count: 3,
          payPrice: 6,
          saved: 3
        },
        {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00,
          count: 2,
          payPrice: 30,
          saved: 0
        }
      ];

      expect(promotedItems).toEqual(expectPromotedItems);
    });
    it('#5 计算总价', () => {
      let promotedItems = [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          count: 3,
          payPrice: 6,
          saved: 3
        },
        {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00,
          count: 2,
          payPrice: 30,
          saved: 0
        }
      ];

      let totalPrices = calculateTotalPrices(promotedItems);

      let expectTotalPrices =
      {
        totalPayPrice: 36,
        totalSaved: 3
      };

      expect(totalPrices).toEqual(expectTotalPrices);

    });

    it('#6 最终结果', () => {

      let totalPrices = {
        totalPayPrice: 36,
        totalSaved: 3
      };

      let promotedItems = [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          count: 3,
          payPrice: 6,
          saved: 3
        },
        {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00,
          count: 2,
          payPrice: 30,
          saved: 0
        }
      ];

      let receipt = buildReceipt(promotedItems, totalPrices);

      let expectReceipt = {
        receiptItems: [
          {
            name: '雪碧',
            unit: '瓶',
            price: 3.00,
            count: 3,
            payPrice: 6
          },
          {
            name: '荔枝',
            unit: '斤',
            price: 15.00,
            count: 2,
            payPrice: 30
          }
        ],
        totalPayPrice: 36,
        totalSaved: 3
      };

      expect(receipt).toEqual(expectReceipt);
    });

     /*  it('should print text', () => {

     const tags  = [
     'ITEM000001',
     'ITEM000001',
     'ITEM000001',
     'ITEM000001',
     'ITEM000001',
     'ITEM000003-2',
     'ITEM000005',
     'ITEM000005',
     'ITEM000005'

     ];

     spyOn(console, 'log');

     printReceiptString(tags);

     const expectText = `***<没钱赚商店>收据***
     名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
     名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
     名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
     ----------------------
     总计：51.00(元)
     节省：7.50(元)
     **********************`;

     expect(console.log).toHaveBeenCalledWith(expectText);
     });*/
  });
});
