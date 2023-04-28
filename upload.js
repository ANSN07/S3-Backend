const AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  sessionToken: process.env.aws_session_token,
});

const s3 = new AWS.S3({
  region: "us-east-1", //
});

const uploadFile = async (req, res, next) => {
  var file_id = req.params["id"];
  const downloadPath1 = "encrypted_myFile512MB.dat";
  const downloadPath2 = "encrypted_myFile1GB.dat";
  const downloadPath3 = "encrypted_myFile5GB.dat";
  const paths = {
    1: downloadPath1,
    2: downloadPath2,
    3: downloadPath3,
  };
  const outputFile = paths[file_id];
  const bucketName = "webapp1buckett";
  let startTime = performance.now();
  fs.readFile(outputFile, function (err, data) {
    if (err) {
      throw err;
    }

    const params = { Bucket: bucketName, Key: outputFile, Body: data };

    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        const endTime = performance.now();
        const elapsedTime = ((endTime - startTime) / 1000).toFixed(2);
        console.log("Successfully uploaded data to webapp1buckett");
        res.send({ Elapsed_time: elapsedTime });
      }
    });
  });
};
module.exports = { uploadFile };
