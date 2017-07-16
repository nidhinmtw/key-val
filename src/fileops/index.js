const fileWriter = require('./fileWrite');
const fileReader = require('./fileRead');

module.exports = {
    writeJSON: fileWriter.writeJSON,
    readJSON: fileReader.readJSON,
    exists: fileReader.fileExists
}