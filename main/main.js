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

module.exports = {
  formatTags: formatTags,
  countItmes: countItmes,
  buildItems: buildItems,
  loadAllItems: loadAllItems,
}

