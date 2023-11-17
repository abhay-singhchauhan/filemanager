const rootFolder = require("../models/rootFolders");
const fileData = require("../models/filedata");

const AWS = require("aws-sdk");
require("dotenv").config();

//creating aws folder
function createFoler(path, folder) {
  // Set your AWS credentials and region
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "us-east-1",
  });

  // Create an S3 object
  const s3 = new AWS.S3();

  // Specify the bucket name and folder (prefix) you want to create
  const bucketName = "file.manager.app";
  const folderName = path;
  console.log(folderName, "this is the folder name", folder);
  // Define the parameters for the S3 API call
  const params = {
    Bucket: bucketName,
    Key: folderName + "/" + folder + "/",
    Body: "",
    // ACL: "public-read", // Adjust the ACL as needed
  };

  // Create the folder in the S3 bucket
  return new Promise((resolve, reject) => {
    s3.upload(params, async function (err, data) {
      if (err) {
        console.error("Error creating folder:", err);
        reject(err);
      } else {
        console.log("Folder created successfully:", data.Location, data);
        resolve(data);
      }
    });
  });
}

function checkIfPresent(path, folderName) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "us-east-1",
  });

  // Create an S3 object
  const s3 = new AWS.S3();

  // Specify the bucket name and folder (prefix) within the bucket
  const bucketName = "file.manager.app";
  const folderPath = path;

  // Parameters for listing objects in a bucket
  const params = {
    Bucket: bucketName,
    Prefix: folderPath,
  };

  // Use the AWS SDK to list objects in the specified folder
  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        // Extract and print the object keys (file names) in the folder
        const contents = data.Contents;
        let present = false;
        contents.forEach((content) => {
          if (content.Key === path + "/" + folderName + "/") {
            present = true;
          }
        });
        if (present) {
          reject("isPresent");
        } else {
          resolve(data);
        }
      }
    });
  });
}

function listFolder(path) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "us-east-1",
  });

  // Create an S3 object
  const s3 = new AWS.S3();

  // Specify the bucket name and folder (prefix) within the bucket
  const bucketName = "file.manager.app";
  const folderPath = path;

  // Parameters for listing objects in a bucket
  const params = {
    Bucket: bucketName,
    Prefix: folderPath,
  };

  // Use the AWS SDK to list objects in the specified folder
  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        // Extract and print the object keys (file names) in the folder
        const contents = data.Contents;
        let arr = [];
        console.log(path, "here is the path");
        contents.forEach((content) => {
          arr.push(content.Key.slice(path.length, content.Key.length));
        });
        resolve(arr);
      }
    });
  });
}

exports.addFolder = async (req, res, next) => {
  try {
    let data = await checkIfPresent(req.body.path, req.body.folder);
    let addingFolder = await createFoler(req.body.path, req.body.folder);
    res.send(addingFolder);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getData = async (req, res, next) => {
  try {
    console.log(req.body);
    const list = await listFolder(req.body.path);
    console.log(list);
    res.json(list);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.homePage = async (req, res, next) => {
  try {
    let user = await rootFolder.findOne({ where: { userId: req.user.id } });
    console.log(user);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addFile = async (req, res, next) => {
  try {
    console.log(req.body.path, "<<<<>>>>", req.body);
    const file = await fileData.create({
      fileName: req.body.name,
      fileSize: req.body.size,
      fileLocation: req.body.path,
      userId: req.user.id,
    });
    console.log("inside add file functino");
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: "us-east-1",
      signatureVersion: "v4",
    });
    const param = {
      Bucket: "file.manager.app",
      Key: req.body.path,
      Expires: 60,
    };
    const uploadUrl = await s3.getSignedUrlPromise("putObject", param);
    console.log(uploadUrl);
    res.json(uploadUrl);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

function deleteObject(path, folder) {
  // Set your AWS credentials and region
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "us-east-1",
  });

  // Create an S3 object
  const s3 = new AWS.S3();

  // Specify the bucket name and folder (prefix) you want to create
  const bucketName = "file.manager.app";
  const folderName = path;

  // Define the parameters for the S3 API call
  const params = {
    Bucket: bucketName,
    Key: folderName,
  };

  // delete the object in the S3 bucket
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, async function (err, data) {
      if (err) {
        reject(err);
      } else {
        console.log("Folder created successfully:", data.Location, data);
        resolve(data);
      }
    });
  });
}

async function deleteFolder(bucketName, folderPath) {
  try {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: "us-east-1",
    });

    // List the objects in the folder to get their keys
    const data = await s3
      .listObjectsV2({ Bucket: bucketName, Prefix: folderPath })
      .promise();

    // Extract object keys
    const objectKeys = data.Contents.map((obj) => ({ Key: obj.Key }));

    // Delete the objects
    const deleteData = await s3
      .deleteObjects({ Bucket: bucketName, Delete: { Objects: objectKeys } })
      .promise();

    console.log("Objects in folder deleted successfully:", deleteData.Deleted);
  } catch (err) {
    console.error(err);
  }
}

exports.deleteFunc = async (req, res, next) => {
  try {
    console.log(req.headers);
    if (req.headers.path[req.headers.path.length - 1] === "/") {
      deleteFolder("file.manager.app", req.headers.path);
      res.json({ success: true });
    } else {
      const deleteIt = await deleteObject(req.headers.path);
      res.json({ success: true });
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};
