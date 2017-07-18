const fileWriter = require('./fileWrite');
const fileReader = require('./fileRead');
const fileEventManager = require('./fileopEvents');
let writeTimeout;
let isWriteInProgress = false;
function writeOperation(path, data) {
    if (writeTimeout) {
        clearTimeout(writeTimeout);
    }
    if (isWriteInProgress === false) {
        writeTimeout = setTimeout(() => {
            isWriteInProgress = true;
            fileWriter.writeJSON(path, data)
                .then(() => {
                    isWriteInProgress = false;
                });
        }, 1000);
    }
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
    exists: fileReader.fileExists,
    eventManager: fileEventManager
}