'use strict';
let _ = require('lodash');
let {loadAllItems} = require('../spec/fixtures.js');
let {loadPromotions} = require('../spec/fixtures.js');

function formatTags(tags) {
  return _.map(tags,tag =>{
    if(tag.includes('-')){
      let [barcode,count] = tag.split('-');
      return {
        barcode,count: parseFloat(count)
      }
    }
    else{
      return {
        barcode: tag,
        count: 1
      }
    }
  });
}

module.exports = {
  formatTags:formatTags
};