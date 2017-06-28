const moment = require('moment');

var now = Date.now();
var now2 = moment().valueOf();
var then = moment(now).format('dddd, MMMM Do YYY, h:mm:ss a')

console.log(now);
console.log(then);
