// const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

var token = jwt.sign(data, '1320948asdfasdfasdlkf');
console.log(token);

var decoded = jwt.verify(token, '1320948asdfasdfasdlkf');
console.log(`Decoded: ${decoded.id}`);










// var message = 'whatup b';
//
// var hash = SHA256(message).toString();
//
// console.log('message: ' + message);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 3
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)).toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data)).toString();
//
// if (resultHash === token.hash) {
//   console.log('yeah buddy');
// } else {
//   console.log('fuck ya\'ll hacker mofuckaas');
// }
