'use strict';
let{getFormatTags,
   getCountedItems,
   buildCartItems,
  buildPromotionItems,
  calculateTotalPrice,
  buildReceipt,
  printReceipt
}=require('../main/main');

describe('pos', () => {
  it('it should format tags', ()=> {
    const input = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    let expected = [
      {
        barcode: 'ITEM000001',
        count:1
      },
      {
        barcode: 'ITEM000001',
        count:1
      },
      {
        barcode: 'ITEM000001',
        count:1
      },
      {
        barcode: 'ITEM000001',
        count:1
      }, {
        barcode: 'ITEM000001',
        count:1
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
    let result = getFormatTags(input);
    expect(result).toEqual(result)
  });


  it('should  get Count Items',()=>{
  let input=[
    {
      barcode: 'ITEM000001',
      count:1
    },
    {
      barcode: 'ITEM000001',
      count:1
    },
    {
      barcode: 'ITEM000001',
      count:1
    },
    {
      barcode: 'ITEM000001',
      count:1
    }, {
      barcode: 'ITEM000001',
      count:1
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
    }];
    let expected=[
      {
        barcode: 'ITEM000001',
        count:5
      },
      {
        barcode: 'ITEM000003',
        count: 2.5
      },
      {
        barcode: 'ITEM000005',
        count: 3
      },
     ];
    let result=getCountedItems(input);
    expect(result).toEqual(expected)
  });
 it('should build Cart Items',()=>{
   let input=[
     {
       barcode: 'ITEM000001',
       count:5
     },
     {
       barcode: 'ITEM000003',
       count: 2.5
     },
     {
       barcode: 'ITEM000005',
       count: 3
     },
   ];
    let allItems=[
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
    let expected=[
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count:5
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count:2.5
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count:3
      }
    ];
    let result=buildCartItems(input,allItems);
      expect(result).toEqual(expected)
  });

it('should build promoted items',()=>{
  let input=[
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00,
      count:5
    },
    {
      barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15.00,
      count:2.5
    },
    {
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50,
      count:3
    }
  ];
    let promotions=[
      {
        type: 'BUY_TWO_GET_ONE_FREE',
        barcodes: [
          'ITEM000000',
          'ITEM000001',
          'ITEM000005'
        ]
      }
    ];
  let expected=[
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00,
      count:5,
      payPrice:12.00,
      saved:3.00
    },
    {
      barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15.00,
      count:2.5,
      payPrice:37.50,
      saved:0.00
    },
    {
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50,
      count:3,
      payPrice:9.00,
      saved:4.50
    }
  ];
  let result=buildPromotionItems(input,promotions);
  expect(result).toEqual(expected)
});
  it('should calculate totalPayPrice',()=>{

    let input=[
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count:5,
        payPrice:12.00,
        saved:3.00
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count:2.5,
        payPrice:37.50,
        saved:0.00
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count:3,
        payPrice:9.00,
        saved:4.50
      }
    ];
    let result=calculateTotalPrice(input);
    let expected={totalPayPrice:58.50, totalSaved:7.50};
    expect(result).toEqual(expected)
  });
  it('it should build receipt',()=>{
    let input=[
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count:5,
        payPrice:12.00,
        saved:3.00
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count:2.5,
        payPrice:37.50,
        saved:0.00
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count:3,
        payPrice:9.00,
        saved:4.50
      }
    ];
    let expected={
      cartItems: [
      {
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count:5,
        payPrice:12.00,
      },
      {
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count:2.5,
        payPrice:37.50,
      },
      {
        name: '方便面',
        unit: '袋',
        price: 4.50,
        count:3,
        payPrice:9.00,
      }
    ],
    totalPayPrice:58.50,
      totalSaved:7.50
    };
    let result=buildReceipt(input,{totalPayPrice:58.50, totalSaved:7.50});
     expect(result).toEqual(expected)
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
