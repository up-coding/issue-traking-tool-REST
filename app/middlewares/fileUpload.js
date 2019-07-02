const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require("../../confi/awsConfig");

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_SECRET_ACCESS_ID,
  region: config.REGION
});
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "issue-traking-files",

    metadata: function(req, file, cb) {
      cb(null, { fieldName: "testing" });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

let fileUpload = upload.array("files", 10);

module.exports = {
  upload: fileUpload
};
