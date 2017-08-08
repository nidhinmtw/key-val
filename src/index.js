const FILE_OPS = require('./fileops');
let keyval = require('./keyval');
const KVD_EXTN = '.kvd';

const promiseCallbackProvider = function (path, callback) {
    return (resolve, reject) => {
        let kvDb;
        if(path.toLowerCase().lastIndexOf(KVD_EXTN) !== path.length - (KVD_EXTN.length)) {
            path = path.concat(KVD_EXTN);
        }
        FILE_OPS.exists(path).
            then(isExists => {
                console.log('File existence .. ', isExists);
                if (isExists) {
                    FILE_OPS.readJSON(path).
                        then(data => {
                            // kvDb = data;
                            const kvInstance = keyval(data, path);
                            resolve(kvInstance);
                        }).
                        catch(err => {
                            console.log('read json err', err);
                        });
                } else {
                    const blank_data = {};
                    FILE_OPS.writeJSON(path, blank_data).
                        then(err => {
                            if (err) {
                                throw 'Write JSON failed...' + err;
                                return;
                            }
                            // kvDb = blank_data;
                            const kvInstance = keyval(blank_data, path);
                            resolve(kvInstance);
                        })
                        .catch(err => {
                            console.log('write json err', err);
                        });
                }
            }).
            catch(err => {
                console.log('Exists error' + err);
            });
    }
};

function use(path, callback) {
    callback = callback || function () { };
    return new Promise(promiseCallbackProvider(path, callback));
};

module.exports = { use };