const AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

AWS.config.update(
  {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token,
  },
  { httpOptions: { timeout: 360000 } }
);

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

  const uploadOp = async () => {
    const stream = fs.createReadStream(outputFile);

    const paramsObj = {
      Bucket: bucketName,
      Key: outputFile,
      Body: stream,
      ACL: "public-read",
    };

    const options = {
      partSize: 10 * 1024 * 1024,
      queueSize: 1,
    };

    try {
      await s3.upload(paramsObj, options).promise();
      console.log("upload OK");
      const endTime = performance.now();
      const elapsedTime = ((endTime - startTime) / 1000).toFixed(2);
      console.log("Successfully uploaded data to webapp1buckett");
      res.send({ Elapsed_time: elapsedTime });
    } catch (error) {
      console.log("upload ERROR", error);
    }
  };
  uploadOp();
};
module.exports = { uploadFile };
