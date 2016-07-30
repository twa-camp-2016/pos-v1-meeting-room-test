'use strict';
let {getFormattedTags, getCount,loadAllItems,getCartItems,loadPromotions,getPayPrice}=require('../main/main');
describe('pos', () => {
  it('getFormattedTags', function () {
    let tags = ['ITEM000001', 'ITEM000001', 'ITEM000003-2.5'];
    let formattedTags = getFormattedTags(tags);
    let expected = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2.5}]
    expect(formattedTags).toEqual(expected);
  });
  it('getCount', function () {
    let formattedTags = [
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2.5}];
    let countBarcodes = getCount(formattedTags);
    let expected = [
      {barcode: 'ITEM000001', count: 2},
      {barcode: 'ITEM000003', count: 2.5}];
    expect(countBarcodes).toEqual(expected);
  });
  it('getCartItems', function () {
    let countBarcodes = [
      {barcode: 'ITEM000001', count: 2},
      {barcode: 'ITEM000003', count: 2.5}];
    let allItems = loadAllItems();
    let cartItems = getCartItems(allItems, countBarcodes);
    let expected = [
      {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3, count: 2},
      {barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15, count: 2.5}];
    expect(cartItems).toEqual(expected);
  });
  it('getPromotions',function () {
    let promotions = loadPromotions();
    let cartItems =[
      { barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3, count: 5},
      { barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15, count: 2}];
    let promotionItems =getPayPrice(promotions,cartItems);
    let expected = [
      { barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3, count: 5, payPrice: 12, saved: 3 },
      { barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15, count: 2, payPrice: 30, saved: 0 } ];
    expect(promotionItems).toEqual(expected);
  });
  
// it('should print text', () => {
//
//   const tags = [
//     'ITEM000001',
//     'ITEM000001',
//     'ITEM000001',
//     'ITEM000001',
//     'ITEM000001',
//     'ITEM000003-2.5',
//     'ITEM000005',
//     'ITEM000005-2',
//   ];
//
//   spyOn(console, 'log');
//
//   printReceipt(tags);
//
//   const expectText = `***<没钱赚商店>收据***
// 名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
// 名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
// 名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
// ----------------------
// 总计：58.50(元)
// 节省：7.50(元)
// **********************`;
//
//   expect(console.log).toHaveBeenCalledWith(expectText);
// });
})
;
