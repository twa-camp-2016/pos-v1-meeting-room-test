'use strict';
let {printReceipt,buildReceipt,calcaculateTalPrices,buildPromotedItems,getFormatTags,countBarcodes,buildCartItems}=require('../main/main');
let {loadAllItems,loadPromotions} = require('../spec/fixtures')
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

  it('#1should getformatTags text',()=>{
    const tags = [

      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005',
      'ITEM000005'

    ];

    let formattedTags   =	getFormatTags(tags);

    const expectText =
      [
        { barcode: 'ITEM000001', count: 1},
        { barcode: 'ITEM000001', count: 1},
        { barcode: 'ITEM000001', count: 1},
        { barcode: 'ITEM000001', count: 1},
        { barcode: 'ITEM000001', count: 1},
        { barcode: 'ITEM000003', count: 2.5},
        { barcode: 'ITEM000005', count: 1},
        { barcode: 'ITEM000005', count: 1},
        { barcode: 'ITEM000005', count: 1}
      ]  ;

    expect(formattedTags).toEqual(expectText);
  });
  it('#2should itemsTags text',()=>{
    const formattedTags =
      [
        { barcode: 'ITEM000001', count: 1},
        { barcode: 'ITEM000001', count: 1},
        { barcode: 'ITEM000001', count: 1},
        { barcode: 'ITEM000001', count: 1},
        { barcode: 'ITEM000001', count: 1},
        { barcode: 'ITEM000003', count: 2},
        { barcode: 'ITEM000005', count: 1},
        { barcode: 'ITEM000005', count: 1},
        { barcode: 'ITEM000005', count: 1}
      ]
    let itemsTags = countBarcodes(formattedTags);


    const expectText =
      [ { barcode: 'ITEM000001', count: 5 },
        { barcode: 'ITEM000003', count: 2 },
        { barcode: 'ITEM000005', count: 3 } ];

    expect(itemsTags).toEqual(expectText);
  });
  it('#3should buildCartItems text',()=>{
    const itemsTags =
      [ { barcode: 'ITEM000001', count: 5 },
        { barcode: 'ITEM000003', count: 2 },
        { barcode: 'ITEM000005', count: 3 } ];


    let allItems = loadAllItems();
    let cartItems = buildCartItems(itemsTags, allItems);



    const expectText =
      [ { barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5 },
        { barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00,
          count: 2 },
        { barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.50,
          count: 3 }
      ];

    expect(cartItems).toEqual(expectText);
  });
  it('#4should promotions text',()=>{
    const cartItems =
      [ { barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5 },
        { barcode: 'ITEM000003',
          name: '荔枝',unit: '斤',
          price: 15.00,
          count: 2 },
        { barcode: 'ITEM000005',
          name: '方便 面',
          unit: '袋',
          price: 4.50,
          count: 3 }
      ];

    let promotions = loadPromotions();
    let promotedItems = buildPromotedItems(cartItems, promotions);

    const expectText =
      [ { barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5,
        payPrice: 12.00,
        saved: 3.00
      },
        { barcode: 'ITEM000003',
          name: '荔枝',unit: '斤',
          price: 15.00,
          count: 2,
          payPrice: 30.00,
          saved: 0.00
        },
        { barcode: 'ITEM000005',
          name: '方便 面',
          unit: '袋',
          price: 4.50,
          count: 3,
          payPrice: 9.00,
          saved: 4.50}
      ];

    expect(promotedItems).toEqual(expectText);

  });
  it('#5should totalPrices text',()=>{
    let promotedItems=
      [ { barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5,
        payPrice: 12.00,
        saved: 3.00
      },
        { barcode: 'ITEM000003',
          name: '荔枝',unit: '斤',
          price: 15.00,
          count: 2,
          payPrice: 30.00,
          saved: 0.00
        },
        { barcode: 'ITEM000005',
          name: '方便 面',
          unit: '袋',
          price: 4.50,
          count: 3,
          payPrice: 9.00,
          saved: 4.50}
      ];
    let totalPrices = calcaculateTalPrices(promotedItems);
    const expectText ={
      totalPayPrice:51.00,
      totalSaved:7.50
    }
    expect(totalPrices).toEqual(expectText);
  });
  it('#6Should receipt text',()=>{
    let promotedItems=
      [ { barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5,
        payPrice: 12.00,
        saved: 3.00
      },
        { barcode: 'ITEM000003',
          name: '荔枝',unit: '斤',
          price: 15.00,
          count: 2,
          payPrice: 30.00,
          saved: 0.00
        },
        { barcode: 'ITEM000005',
          name: '方便 面',
          unit: '袋',
          price: 4.50,
          count: 3,
          payPrice: 9.00,
          saved: 4.50}
      ];
    let totalPrices= {
      totalPayPrice:51.00,
      totalSaved:7.50
    };
    const expectText ={
      receiptItems:[{
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 5,
        payPrice: 12.00
      },
        {
          name: '荔枝',
          unit: '斤',
          price: 15.00,
          count: 2,
          payPrice: 30.00
        },
        {
          name: '方便 面',
          unit: '袋',
          price: 4.50,
          count: 3,
          payPrice: 9.00
        }
      ],
      totalPayPrice:51.00,
      totalSaved:7.5
    };
    let receipt= buildReceipt(promotedItems, totalPrices);

    expect(receipt).toEqual(expectText);

  });
});
