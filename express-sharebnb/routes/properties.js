"use strict";

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
// const storage = multer.memoryStorage();
const upload = multer();

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

 router.post("/", upload.array("image", 3), async function (req, res, next) {
    
    console.log('req.body: ', req.body);
    let propertyData = req.body;
    if(propertyData.price !== undefined) propertyData.price = +propertyData.price;
    
    const validator = jsonschema.validate(
      propertyData,
      propertyNewSchema,
      {required: true}
    );
    console.log('validator', validator);
    // shouldn't an error be caught by app error handler? Why does it crash the entire server
    
    console.log('req.files', req.files);
    
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    
    const key = randomImageName();
    const body = req.files[0].buffer
    const contentType = req.files[0].mimetype
    
    await uploadImg(key, body, contentType);
    const imageUrl = getImgUrl(key)

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
    
    const imageUrl = getImgUrl(key);

    //caption: req.body.caption, imageName

    // has filename, path, destination, etc

    // const description = req.body.description;
    return res.json({imageUrl});
})

module.exports = router