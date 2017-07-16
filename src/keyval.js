function keyValCreator(data, filepth) {
    function keyval() {
        this.add = (key, val) => {
            data[key] = val;
        };
        this.delete = (key) => {
            data[key] = undefined;
            delete data[key];
        };
        this.modify = (key, val) => {
            Object.assign(data[key], val);
        };
        this.get = (key) => {
            return data[key];
        }
    }
    return new keyval();
}

module.exports = keyValCreator;