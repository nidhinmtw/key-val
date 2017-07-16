const fs = require('fs');

function readJSON(path, callback) {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {
        readFromFile(path, (err, data) => {
            if (err) {
                reject(err);
                callback(err);
                return;
            }
            const jsonData = JSON.parse(data);
            resolve(jsonData);
            callback(err, jsonData);
        });
    });
}

function readFromFile(path, callback) {
    fs.readFile(path, callback);
}

function fileExists(path, callback) {
    callback = callback || function () {};
    return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if (err) {
                resolve(false);
                callback(false);
                return;
            }
            resolve(true);
            callback(true);
        });
    });
}

module.exports = {
    readJSON: readJSON,
    fileExists: fileExists
}