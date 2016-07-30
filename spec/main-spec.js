let {formatTags, countBarcodes, buildCartItems, buildPromotedItems, calculateTotalPrice, buildReceipt,printReceiptString} = require('../main/main.js');
let {loadAllItems, loadPromotions} = require('../spec/fixtures.js');


describe('pos', () => {
  it('formatTags', function () {
    let tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005-2'];
    let expected = [
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
        count: 2
      },
    ];
    let formattedTags = formatTags(tags);
    expect(formattedTags).toEqual(expected);
  });

  it('countBarcodes', function () {
    let formattedTags = [{
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
        count: 2
      },
    ];
    let expected = [
      {
        barcode: 'ITEM000001',
        count: 2
      },
      {
        barcode: 'ITEM000003',
        count: 2.5
      },
      {
        barcode: 'ITEM000005',
        count: 2
      },
    ];
    let countedBarcode = countBarcodes(formattedTags);
    expect(countedBarcode).toEqual(expected);
  });

  it('buildCartItems', function () {
    let countedBarcodes = [
      {
        barcode: 'ITEM000001',
        count: 2
      },
      {
        barcode: 'ITEM000003',
        count: 2.5
      },
      {
        barcode: 'ITEM000005',
        count: 2
      },
    ];
    let allItems = loadAllItems();
    let expected = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        count: 2,
        price: 3.00
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        count: 2.5,
        price: 15.00
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        count: 2,
        price: 4.50
      }
    ];
    let cartItems = buildCartItems(countedBarcodes, allItems);
    expect(cartItems).toEqual(expected);
  });

  it('buildPromotedItems', function () {
    let cartItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        count: 3,
        price: 3.00
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        count: 2.5,
        price: 15.00
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        count: 3,
        price: 4.50
      }
    ];
    let expected = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        count: 3,
        price: 3.00,
        saved: 3.00,
        payPrice: 6.00
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        count: 2.5,
        price: 15.00,
        saved: 0,
        payPrice: 37.50
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        count: 3,
        price: 4.50,
        saved: 4.50,
        payPrice: 9.00
      }
    ];
    let promotions = loadPromotions();
    let promotedItems = buildPromotedItems(cartItems, promotions);
    expect(promotedItems).toEqual(expected);
  });

  it('caculateTotalPrice', function () {
    let promotedItems = [{
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      count: 3,
      price: 3.00,
      saved: 3.00,
      payPrice: 6.00
    },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        count: 2.5,
        price: 15.00,
        saved: 0,
        payPrice: 37.50
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        count: 3,
        price: 4.50,
        saved: 4.50,
        payPrice: 9.00
      }
    ];
    let expected = {
      totalPayPrice: 52.50,
      totalSaved: 7.50
    };

    let totalPrice = calculateTotalPrice(promotedItems);
    expect(totalPrice).toEqual(expected);
  });

  it('buildReceipt', function () {
    let promotedItems = [{
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      count: 3,
      price: 3.00,
      saved: 3.00,
      payPrice: 6.00
    },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        count: 2.5,
        price: 15.00,
        saved: 0,
        payPrice: 37.50
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        count: 3,
        price: 4.50,
        saved: 4.50,
        payPrice: 9.00
      }
    ];
    let totalPrice = {
      totalPayPrice: 52.50,
      totalSaved: 7.50
    };

    let expected = {
      receiptItems: [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          count: 3,
          price: 3.00,
          saved: 3.00,
          payPrice: 6.00
        },
        {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          count: 2.5,
          price: 15.00,
          saved: 0,
          payPrice: 37.50
        },
        {
          barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          count: 3,
          price: 4.50,
          saved: 4.50,
          payPrice: 9.00
        }
      ],
      totalPayPrice: 52.50,
      totalSaved: 7.50
    };

    let receipt = buildReceipt(promotedItems,totalPrice);
    expect(receipt).toEqual(expected);
  });

  it('printReceiptString',function () {
    let receipt = {
      receiptItems: [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          count: 3,
          price: 3.00,
          saved: 3.00,
          payPrice: 6.00
        },
        {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          count: 2.5,
          price: 15.00,
          saved: 0,
          payPrice: 37.50
        },
        {
          barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          count: 3,
          price: 4.50,
          saved: 4.50,
          payPrice: 9.00
        }
      ],
      totalPayPrice: 52.50,
      totalSaved: 7.50
    };

    let expected = `***<没钱赚商店>收据***
名称：雪碧，数量：3瓶，单价：3.00(元)，小计：6.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：52.50(元)
节省：7.50(元)
**********************`;

    let receiptString = printReceiptString(receipt);
    expect(receiptString).toEqual(expected);
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
