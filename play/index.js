const { announce } = require("./innerModule");

module.exports = function () {
  console.log("change: 0");
  announce();
};
