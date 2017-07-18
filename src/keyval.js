const eventManager = require('./fileops');
function keyValCreator(data, path) {
    function keyval() {
        this.add = (key, val) => {
            data[key] = val;
            eventManager.trigger('add', {data, path});
        };
        this.delete = (key) => {
            data[key] = undefined;
            delete data[key];
            eventManager.trigger('delete', {data, path});
        };
        this.modify = (key, val) => {
            Object.assign(data[key], val);
            eventManager.trigger('modify', {data, path});
        };
        this.get = (key) => {
            return data[key];
        }
    }
    return new keyval();
}

module.exports = keyValCreator;