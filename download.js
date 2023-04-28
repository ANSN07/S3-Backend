const AWS = require("aws-sdk");
const fs = require("fs");
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  sessionToken: process.env.aws_session_token,
});

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token,
  },
  httpOptions: { timeout: 1800000 },
  signatureVersion: 'v2'
});

const downloadFile = async (req, res, next) => {
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
  const bucketName = "webapp1buckett";
  const objectKey = path;
  let startTime = null;
  const oneMB = 1024 * 1024;

  const getObjectRange = ({ bucket, key, start, end }) => {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      Range: `bytes=${start}-${end}`,
    });
    return s3Client.send(command);
  };

  const getRangeAndLength = (contentRange) => {
    const [range, length] = contentRange.split("/");
    const [start, end] = range.split("-");
    return {
      start: parseInt(start),
      end: parseInt(end),
      length: parseInt(length),
    };
  };

  const isComplete = ({ end, length }) => end === length - 1;

  const downloadInChunks = async ({ bucket, key }) => {

    const writeStream = fs
      .createWriteStream(`./${path}`)
      .on("error", (err) => console.error(err));

    let rangeAndLength = { start: -1, end: -1, length: -1 };
    startTime = performance.now();

    while (!isComplete(rangeAndLength)) {
      const { end } = rangeAndLength;
      const nextRange = { start: end + 1, end: end + oneMB };

      console.log(`Downloading bytes ${nextRange.start} to ${nextRange.end}`);

      const { ContentRange, Body } = await getObjectRange({
        bucket,
        key,
        ...nextRange,
      });

      writeStream.write(await Body.transformToByteArray());
      rangeAndLength = getRangeAndLength(ContentRange);
    }
  };

  downloadInChunks({
    bucket: bucketName,
    key: objectKey,
  }).then(() => {
    const endTime = performance.now();
    const elapsedTime = ((endTime - startTime) / 1000).toFixed(2);
    console.log(elapsedTime, " seconds");
    console.log("Successfully downloaded data");
    res.send({ Elapsed_time: elapsedTime });
  });
};

module.exports = { downloadFile };
