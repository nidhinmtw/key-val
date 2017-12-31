const fs = require("fs");
const KVD_EXTN = ".kvd";

function writeJSON(filename, data, callback) {
  callback = callback || function() {};
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify(data);
    writeToFile(filename, jsonData, err => {
      if (err) {
        reject(err);
        callback(err);
        return;
      }
      resolve(err);
      callback(err);
    });
  });
}

function writeToFile(filename, content, callback, encoding = "utf8") {
  if (
    filename.toLowerCase().lastIndexOf(KVD_EXTN) !==
    filename.length - KVD_EXTN.length
  ) {
    filename = filename.concat(KVD_EXTN);
  }
  fs.writeFile(filename, content, encoding, callback);
}

module.exports = {
  writeJSON: writeJSON,
  writeToFile: writeToFile
};
