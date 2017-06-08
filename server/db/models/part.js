var mongoose = require('mongoose');

var Part = mongoose.model('Parts', {
  description: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    default: 'default text'
  },
  name: {
    type: String,
    require: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {Part};
