var mongoose = require('mongoose');
var schema = mongoose.Schema({
      term: String,
      when: Date
  });

var Search = mongoose.model('Search', schema);

module.exports = Search;