const crypto = require("crypto");
const fs = require("fs");
var encryptor = require("file-encryptor");
require("dotenv").config();

const encryptFile = async (req, res, next) => {
  var file_id = req.params["id"];
  const downloadPath1 = "myFile512MB";
  const downloadPath2 = "myFile1GB";
  const downloadPath3 = "myFile5GB";
  const paths = {
    1: downloadPath1,
    2: downloadPath2,
    3: downloadPath3,
  };
  const path = paths[file_id];
  const outputFile = `encrypted_${path}.dat`;
  var key = crypto.randomBytes(32);
  var options = { algorithm: "aes256" };
  let startTime = performance.now();
  encryptor.encryptFile(path, outputFile, key, options, function (err) {
    fs.stat(outputFile, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(
        `Encryption completed, File size of cipher in bytes: ${stats.size}`
      );
      const endTime = performance.now();
      const elapsedTime = ((endTime - startTime) / 1000).toFixed(2);
      console.log(elapsedTime, " seconds");
      console.log("Successfully encrypted data");
      res.send({ Elapsed_time: elapsedTime });
    });
  });
};

module.exports = { encryptFile };
