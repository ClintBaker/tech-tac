var mongoose = require('mongoose');
var moment = require('moment');

var Order = mongoose.model('Orders', {
  status: {
    type: String,
    require: true,
    default: 'pending'
  },
  parts: [{
    _partId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    _creator: mongoose.Schema.Types.ObjectId,
    price: Number,
    name: String,
    image: String,
    description: String,
    number: Number,
    subtotal: Number
  }],
  _companyId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    default: Date.now(),
    type: String
  },
  total: {
    type: Number
  }
});

module.exports = {Order};


// {
//   _id: 'a;lsdfjwofjsadlkfj',
//   order_number: '12353245',
//   order_date: 'asdf23sdfjka',
//   status: 'not shipped',
//   order_items: [
//     {
//       id: '23498032458',
//       quantity: 3
//     },
//     {
//       id: '123098sdal;fj',
//       quantity: 1
//     }
//   ]
// }
