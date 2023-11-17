const User = require("../models/user");
const rootFolder = require("../models/rootFolders");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AWS = require("aws-sdk");

require("dotenv").config();

//creating jwt token
function auth(name, id) {
  const key = process.env.JWT_SECRET;
  return jwt.sign({ name: name, id: id }, key);
}

//creating aws folder
function createFoler(id) {
  // Set your AWS credentials and region
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "us-east-1",
  });
  console.log(
    process.env.AWS_ACCESS_KEY,
    process.env.AWS_SECRET_KEY,
    "here is the access keys for the aws <<<<"
  );
  // Create an S3 object
  const s3 = new AWS.S3();

  // Specify the bucket name and folder (prefix) you want to create
  const bucketName = "file.manager.app";
  const folderName = crypto.randomUUID() + "/";
  console.log(folderName, "this is the folder name");
  // Define the parameters for the S3 API call
  const params = {
    Bucket: bucketName,
    Key: folderName,
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
        const folder = await rootFolder.create({
          foldername: folderName,
          userId: id,
          location: data.Location,
        });
        resolve(data);
      }
    });
  });
}

exports.signup = async (req, res, next) => {
  const parsedData = req.body;
  try {
    console.log(parsedData, "is here");
    const emailExists = await User.findAll({
      where: { email: parsedData.email },
    });
    if (emailExists.length === 0) {
      bcrypt.hash(parsedData.password, 10, async (err, hash) => {
        console.log("hash>>>>", hash);
        if (err) {
          throw new Error("There is some problem");
        } else {
          const details = await User.create({
            name: parsedData.name,
            email: parsedData.email,
            password: hash,
          });
          const data = await createFoler(details.id);
          console.log(data);
          res.status(200).json(details);
        }
      });
    } else {
      console.log(emailExists);
      res.status(500).json({ error: true });
    }
  } catch (err) {
    console.log("there are some problems", err);
    res.status(500).json({ error: true });
  }
};

exports.login = async (req, res, next) => {
  const userExisted = await User.findAll({
    where: {
      email: req.body.email,
    },
  });
  userExisted;
  if (userExisted.length === 0) {
    res.status(404).json({
      message: "User dosen't existed, please register yourself",
      problem: "UDE",
    });
  } else {
    bcrypt.compare(
      req.body.password,
      userExisted[0].password,
      (error, success) => {
        if (success) {
          res.status(200).json({
            auth: auth(userExisted[0].name, userExisted[0].id),
            message: "Login Successfull",
            problem: "Success",
          });
        } else {
          success;
          res.status(401).json({
            message: "Please enter the correct password",
            problem: "UDE",
          });
        }
      }
    );
  }
};
