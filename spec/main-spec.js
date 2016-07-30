'use strict';
let {formatCartCount,getCartCounts,loadAllItems,buildAllItems,promotionItems,builtPromotedItems,calculateTotalPrice,builtReceipt}=require('../main/main.js');
describe('pos', () => {

  it('should print cart counts',()=>{
    const inputs=[
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    let getCartCounts=formatCartCount(inputs);
    let printCartCounts=[
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000003',count:2.5},
      {barcode:'ITEM000005',count:1},
      {barcode:'ITEM000005',count:2}
    ];

    expect(getCartCounts).toEqual(printCartCounts);
  });

  it('should print cart sumCounts',()=>{
    const inputs=[
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000003',count:2.5},
      {barcode:'ITEM000005',count:1},
      {barcode:'ITEM000005',count:2}
    ];
    let getCounts=getCartCounts(inputs);
    let printCounts=[ { barcode: 'ITEM000001', count: 5 },
      { barcode: 'ITEM000003', count: 2.5 },
      { barcode: 'ITEM000005', count: 3 } ];
    expect(getCounts).toEqual(printCounts);
  });


  it('should print cart items',()=>{
    const inputs=[ { barcode: 'ITEM000001', count: 5 },
      { barcode: 'ITEM000003', count: 2.5 },
      { barcode: 'ITEM000005', count: 3 } ];
    let allItems=loadAllItems();
    let getItems=buildAllItems(inputs,allItems);
    let printItems=[ { barcode: 'ITEM000001',
      name: '雪碧',
      count: 5,
      unit: '瓶',
      price: 3 },
      { barcode: 'ITEM000003',
        name: '荔枝',
        count: 2.5,
        unit: '斤',
        price: 15 },
      { barcode: 'ITEM000005',
        name: '方便面',
        count: 3,
        unit: '袋',
        price: 4.5 } ];
    expect(getItems).toEqual(printItems);
  });

  it('should print cart items',()=>{
    const inputs=[ { barcode: 'ITEM000001',
      name: '雪碧',
      count: 5,
      unit: '瓶',
      price: 3 },
      { barcode: 'ITEM000003',
        name: '荔枝',
        count: 2.5,
        unit: '斤',
        price: 15 },
      { barcode: 'ITEM000005',
        name: '方便面',
        count: 3,
        unit: '袋',
        price: 4.5 } ];
    let promotionItem=promotionItems();
    let getItems=builtPromotedItems(inputs,promotionItem);
    let printItems=[ { barcode: 'ITEM000001',
      name: '雪碧',
      count: 5,
      unit: '瓶',
      price: 3,
      payPrices: 12,
      savePrices: 3 },
      { barcode: 'ITEM000003',
        name: '荔枝',
        count: 2.5,
        unit: '斤',
        price: 15,
        payPrices: 37.5,
        savePrices: 0 },
      { barcode: 'ITEM000005',
        name: '方便面',
        count: 3,
        unit: '袋',
        price: 4.5,
        payPrices: 13.5,
        savePrices: 0 } ];
    expect(getItems).toEqual(printItems);
  });



  it('should print cart items',()=>{
    const inputs=[ { barcode: 'ITEM000001',
      name: '雪碧',
      count: 5,
      unit: '瓶',
      price: 3,
      payPrices: 12,
      savePrices: 3 },
      { barcode: 'ITEM000003',
        name: '荔枝',
        count: 2.5,
        unit: '斤',
        price: 15,
        payPrices: 37.5,
        savePrices: 0 },
      { barcode: 'ITEM000005',
        name: '方便面',
        count: 3,
        unit: '袋',
        price: 4.5,
        payPrices: 13.5,
        savePrices: 0 } ];
    let getPrice=calculateTotalPrice(inputs);
    let printItems={ totalPayPrice: 63, totalSavePrice: 3 };
    expect(getPrice).toEqual(printItems);
  });




  it('should print cart items',()=>{
    const inputs=[ { barcode: 'ITEM000001',
      name: '雪碧',
      count: 5,
      unit: '瓶',
      price: 3,
      payPrices: 12,
      savePrices: 3 },
      { barcode: 'ITEM000003',
        name: '荔枝',
        count: 2.5,
        unit: '斤',
        price: 15,
        payPrices: 37.5,
        savePrices: 0 },
      { barcode: 'ITEM000005',
        name: '方便面',
        count: 3,
        unit: '袋',
        price: 4.5,
        payPrices: 13.5,
        savePrices: 0 } ];
    let input={ totalPayPrice: 63, totalSavePrice: 3 };
    let getReceipt=builtReceipt(inputs,input);
    let printItems={ promotedItems:
      [ { name: '雪碧',
        unit: '瓶',
        price: 3,
        count: 5,
        payPrices: 12,
        savePrices: 3 },
        { name: '荔枝',
          unit: '斤',
          price: 15,
          count: 2.5,
          payPrices: 37.5,
          savePrices: 0 },
        { name: '方便面',
          unit: '袋',
          price: 4.5,
          count: 3,
          payPrices: 13.5,
          savePrices: 0 } ],
      totalPayPrice: 63,
      totalSavePrice: 3 };
    expect(getReceipt).toEqual(printItems);
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
