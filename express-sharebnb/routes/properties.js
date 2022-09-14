"use strict";

require("../helper/s3_buckets.js")

const crypto = require("crypto")
const { uploadImg, getImgUrl, deleteImg } = require("../helper/s3_buckets.js");

/** Routes for properties. */

const express = require("express");
const router = new express.Router();
const multer  = require('multer')

const storage = multer.memoryStorage();
const upload = multer({storage: storage})

const randomImageName = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');

/** POST /properties */

router.post("/image", upload.single("image"), async function (req, res, next) {
    const file = req.file;
    console.log(file);
    console.log("REQ BODY", req.body)
    const buffer = file.buffer

    const key = randomImageName();
    const body = req.file.buffer
    const contentType = req.file.mimetype

    await uploadImg(key, body, contentType);

    //caption: req.body.caption, imageName

    // has filename, path, destination, etc

    // const description = req.body.description;
    return res.json({key: "try", resul: "worked post"});
})

module.exports = router