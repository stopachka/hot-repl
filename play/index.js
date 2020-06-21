const { announce } = require("./innerModule");

module.exports = function () {
  console.log("index change: 0");
  announce();
};
