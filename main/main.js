'use strict';
let _ = require('lodash');

function formatTags(tags) {
  return _.chain(tags)
    .map(tag => {
      let temp = [];
      if (tag.includes('-')) {
        temp = tag.split('-');
        return {
          barcode: temp[0],
          count: parseFloat(temp[1])
        }
      }

      return {
        barcode: tag,
        count: 1
      }
    })
    .value();
}

function countItmes(formattedTags) {
  let result = [];

  formattedTags.map(formattedTag => {
    let item = result.find(n => result.length > 0 && formattedTag.barcode === n.barcode);

    if (item) {
      item.count += formattedTag.count;
    }
    else {
      result.push(formattedTag);
    }
  });

  return result;
}

function buildItems(countedItems, allItems) {
  return _.chain(countedItems)
    .map(countedItem =>{
      let allitem = allItems.find(item => countedItem.barcode === item.barcode);
      return {
        barcode: countedItem.barcode,
        name: allitem.name,
        unit: allitem.unit,
        price: allitem.price,
        count: countedItem.count
      };
    })
    .value();
}

function promotionItems(buildedItems, allPromotinos) {
  return _.chain(buildedItems)
    .map(buildedItem =>{
      let promotion = allPromotinos.find(n => n.type === 'BUY_TWO_GET_ONE_FREE');
      let temp = promotion.barcodes.find(n => n === buildedItem.barcode);
      let totalSaved = 0;

      if(temp){
        let savedCount = _.floor(buildedItem.count / 3);
        totalSaved = parseFloat((savedCount * buildedItem.price).toFixed(2));
      }

      let totalPayPrice = parseFloat((buildedItem.count * buildedItem.price - totalSaved).toFixed(2));
      return {
        barcode: buildedItem.barcode,
        name: buildedItem.name,
        unit: buildedItem.unit,
        price: buildedItem.price,
        count: buildedItem.count,
        totalSaved,
        totalPayPrice
      }
    })
    .value();
}

function buildReceipt(promotedItems) {
  let totalPayPrices = 0;
  let totalSaveds = 0;

  promotedItems.map(promotedItem =>{
    totalPayPrices += promotedItem.totalPayPrice;
    totalSaveds += promotedItem.totalSaved;
  });

  return {
    promotedItems,
    totalPayPrices,
    totalSaveds
  };
}
// ***<没钱赚商店>收据***
// 名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
// 名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
// 名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
// ----------------------
// 总计：58.50(元)
// 节省：7.50(元)
// **********************
function buildReceiptString(receipt) {
  let lines = [];
  lines.push('***<没钱赚商店>收据***');
  receipt.promotedItems.map(item =>{
    lines.push(`名称：${item.name}，数量：${item.count}${item.unit}，单价：${parseFloat(item.price).toFixed(2)}(元)，小计：${parseFloat(item.totalPayPrice).toFixed(2)}(元)`);
  });
  lines.push('----------------------');
  lines.push(`总计：${parseFloat(receipt.totalPayPrices).toFixed(2)}(元)`);
  lines.push(`节省：${parseFloat(receipt.totalSaveds).toFixed(2)}(元)`);
  lines.push('**********************');

  return lines.join('\n');
}

function printReceipt(tags) {
  let formattedTags = formatTags(tags);
  let countedItems = countItmes(formattedTags);
  let buildedItems = buildItems(countedItems, loadAllItems());
  let promotedItems = promotionItems(buildedItems, loadPromotions());
  let receipt = buildReceipt(promotedItems);

  console.log(buildReceiptString(receipt));
}

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


module.exports = {
  formatTags: formatTags,
  countItmes: countItmes,
  buildItems: buildItems,
  loadAllItems: loadAllItems,
  loadPromotions: loadPromotions,
  promotionItems: promotionItems,
  buildReceipt: buildReceipt,
  printReceipt: printReceipt
}

