const eventManager = require('./fileops').eventManager;
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
            const item = data[key];
            if(!item) {
                data[key] = val;
            } else if(typeof item === 'string') {
                data[key] = val;
            } else if(Array.isArray(item)) {
                data[key] = val;
            } else if (typeof item === 'object') {
                Object.assign(data[key], val);
            }
            eventManager.trigger('modify', {data, path});
        };
        this.get = (key) => {
            return data[key];
        }
    }
    return new keyval();
}

module.exports = keyValCreator;