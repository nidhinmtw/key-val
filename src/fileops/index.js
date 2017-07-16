const fileWriter = require('./fileWrite');
const fileReader = require('./fileRead');
const fileEventManager = require('./fileopEvents');
let writeTimeout;
function writeOperation(path, data) {
    if (writeTimeout) {
        clearTimeout(writeTimeout);
    }
    writeTimeout = setTimeout(() => {
        fileWriter.writeJSON(path, data);
    }, 1000);
}

function addData(data) {
    writeOperation(data.path, data.data);
}
function deleteData(data) {
    writeOperation(data.path, data.data);
}
function modifyData(data) {
    writeOperation(data.path, data.data);
}
fileEventManager.addEventListener('add', addData);
fileEventManager.addEventListener('delete', deleteData);
fileEventManager.addEventListener('modify', modifyData);



module.exports = {
    writeJSON: fileWriter.writeJSON,
    readJSON: fileReader.readJSON,
    exists: fileReader.fileExists
}