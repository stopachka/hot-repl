const { announce } = require('./innerModule');

module.exports = function () {
  console.log('changed 1');
  announce();
}