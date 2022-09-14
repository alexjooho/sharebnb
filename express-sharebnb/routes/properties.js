"use strict";

require("../helper/s3_buckets.js")

const crypto = require("crypto")
const { uploadImg, getImgUrl, deleteImg } = require("../helpers/s3.js");

const jsonschema = require("jsonschema");

/** Routes for properties. */

const express = require("express");

const propertyNewSchema = require("../schemas/propertyNew.json");
const propertyUpdateSchema = require("../schemas/propertyUpdate.json");
const propertySearchSchema = require("../schemas/propertySearch.json");

const router = new express.Router();

const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage: storage})

const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Property = require("../models/property");

const randomImageName = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');

/** POST / { property }, image file =>  { property }
 *
 * property should be { name, address, owner, price }
 * image file should be an upload
 *
 * Returns { name, address, imageUrl, owner, price }
 *
 * Authorization required: User
 */

 router.post("/", ensureLoggedIn, upload.single("image"), async function (req, res, next) {
    const validator = jsonschema.validate(
      req.body,
      propertyNewSchema,
      {required: true}
    );
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    
    const key = randomImageName();
    const body = req.file.buffer
    const contentType = req.file.mimetype
    
    await uploadImg(key, body, contentType);
    const imageUrl = getImgUrl(key)
    
    let propertyData = req.body;
    propertyData.imageUrl = imageUrl;
  
    const property = await Property.create(propertyData);
    return res.status(201).json({ property });
  });

/** test for making sure aws works */
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