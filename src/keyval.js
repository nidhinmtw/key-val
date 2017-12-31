const eventManager = require("./fileops").eventManager;
const objOperator = require("./objectops");
function keyValCreator(data, path) {
  function keyval() {
    this.add = (key, ...val) => {
      objOperator.add(data, key, ...val);
      eventManager.trigger("add", { data, path });
    };
    this.remove = (...keys) => {
      objOperator.remove(data, ...keys);
      eventManager.trigger("delete", { data, path });
    };
    this.modify = (key, ...val) => {
      objOperator.modify(data, key, ...val);
      eventManager.trigger("modify", { data, path });
    };
    this.get = (...keys) => {
      return objOperator.get(data, ...keys);
    };
  }
  return new keyval();
}

module.exports = keyValCreator;
