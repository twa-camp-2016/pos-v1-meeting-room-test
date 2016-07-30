'use strict';
let _ = require('lodash');
let {loadAllItems} = require('../spec/fixtures.js');
let {loadPromotions} = require('../spec/fixtures.js');

function formatTags(tags) {
  return _.map(tags, tag => {
    if (tag.includes('-')) {
      let [barcode,count] = tag.split('-');
      return {
        barcode, count: parseFloat(count)
      }
    }
    else {
      return {barcode: tag, count: 1}
    }
  });
}

function _getExitElementByBarcodes(array, barcode) {
  return _(array).find(element => element.barcode === barcode);
}

function countBarcodes(formattedTags) {
  return _(formattedTags).reduce((result, formattedTag) => {
    let found = _getExitElementByBarcodes(result, formattedTag.barcode);
    if (found) {
      found.count += formattedTag.count;
    }
    else {
      result.push(formattedTag);
    }
    return result;
  }, []);
}

function buildCartItems(countedBarcodes, allItems) {
  return _.map(countedBarcodes,({barcode, count}) => {
      let {name, unit, price} = _getExitElementByBarcodes(allItems, barcode);
      return {barcode, name, unit, count, price};
    }
  );
}

function buildPromotedItems(cartItems,promotions) {
  let currentPromoted = _.find((promotions),promotion => promotion.type === 'BUY_TWO_GET_ONE_FREE');
  return _.map((cartItems),cartItem => {
    let hasPromotion = currentPromoted.barcodes.includes(cartItem.barcode) && cartItem.count > 2;
    let savedCount = _.floor(cartItem.count/3);
    let saved = hasPromotion ? savedCount*cartItem.price : 0;
    let payPrice = cartItem.count * cartItem.price - saved;
    return Object.assign({},cartItem,{saved,payPrice})
  });
}

module.exports = {
  formatTags: formatTags,
  countBarcodes: countBarcodes,
  buildCartItems: buildCartItems,
  buildPromotedItems: buildPromotedItems
};