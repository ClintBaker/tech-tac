var mongoose = require('mongoose');

var Part = mongoose.model('Parts', {
  description: {
    type: String,
    minlength: 1,
    trim: true,
    default: 'default text'
  },
  name: {
    type: String,
    require: true,
    minlength: 1,
    trim: true
  },
  number: {
    type: Number
  },
  image: {
    type: String
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = {Part};
