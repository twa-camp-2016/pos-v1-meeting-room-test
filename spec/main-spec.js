/*global descrieb,*/
'use strict';

let {
  formatTags,
  countItmes,
  buildItems,
  loadAllItems,
  loadPromotions,
  promotionItems,
  buildReceipt,
  printReceipt
}
  = require('../main/main');


describe('pos', () => {

  it('should formatTags', () => {
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

    let formattedTags = formatTags(tags);

    const expected = [
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000003',
        count: 2.5
      },
      {
        barcode: 'ITEM000005',
        count: 1
      },
      {
        barcode: 'ITEM000005',
        count: 2
      }
    ];

    expect(formattedTags).toEqual(expected);
  });

  it('should countItems', () => {
    const formattedTags = [
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000003',
        count: 2.5
      },
      {
        barcode: 'ITEM000005',
        count: 1
      },
      {
        barcode: 'ITEM000005',
        count: 2
      }
    ];

    let countedItems = countItmes(formattedTags);

    const expected = [
      {
        barcode: 'ITEM000001',
        count: 5
      },
      {
        barcode: 'ITEM000003',
        count: 2.5
      },
      {
        barcode: 'ITEM000005',
        count: 3
      }
    ];

    expect(countedItems).toEqual(expected);

  });

  it('should buildItems', () =>{
    const countedItems = [
      {
        barcode: 'ITEM000001',
        count: 5
      },
      {
        barcode: 'ITEM000003',
        count: 2.5
      },
      {
        barcode: 'ITEM000005',
        count: 3
      }
    ];

    let allItems = loadAllItems();

    let buildedItems = buildItems(countedItems, allItems);

    const expected = [
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

    expect(buildedItems).toEqual(expected)
  });

  it('should promotionItems', () =>{
    const buildedItems = [
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

    let allPromotions = loadPromotions();

    let promotedItems = promotionItems(buildedItems, allPromotions);

    const expected = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5,
        totalSaved: 3.00,
        totalPayPrice: 12.00
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2.5,
        totalSaved: 0,
        totalPayPrice: 37.50
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count: 3,
        totalSaved: 4.50,
        totalPayPrice: 9.00
      }
    ];

    expect(promotedItems).toEqual(expected);
  });

  it('should buildReceipt', ()=>{
    const promotedItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5,
        totalSaved: 3.00,
        totalPayPrice: 12.00
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2.5,
        totalSaved: 0,
        totalPayPrice: 37.50
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count: 3,
        totalSaved: 4.50,
        totalPayPrice: 9.00
      }
    ];

    let receipt = buildReceipt(promotedItems);

    const expected = {
      promotedItems: [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          count: 5,
          totalSaved: 3.00,
          totalPayPrice: 12.00
        },
        {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00,
          count: 2.5,
          totalSaved: 0,
          totalPayPrice: 37.50
        },
        {
          barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.50,
          count: 3,
          totalSaved: 4.50,
          totalPayPrice: 9.00
        }
      ],
      totalPayPrices: 58.50,
      totalSaveds: 7.50
    };

    expect(receipt).toEqual(expected);
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


