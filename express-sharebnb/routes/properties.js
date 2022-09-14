"use strict";

const crypto = require("crypto");
const { uploadImg, getImgUrl, deleteImg } = require("../helpers/s3.js");

const jsonschema = require("jsonschema");

/** Routes for properties. */

const express = require("express");

const propertyNewSchema = require("../schemas/propertyNew.json");
const propertyUpdateSchema = require("../schemas/propertyUpdate.json");
const propertySearchSchema = require("../schemas/propertySearch.json");

const router = new express.Router();

const multer = require('multer');
// const storage = multer.memoryStorage();
const upload = multer();

const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Property = require("../models/property");

const randomImageName = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');

/** POST / { property }, image file =>  { property }
 *
 * property should be { name, address, price }
 * image file should be an upload
 *
 * Returns { name, address, imageUrl, owner, price }
 *
 * Authorization required: User
 */

// retreive username from user
router.post("/",
ensureLoggedIn,
upload.array("image", 3),
async function (req, res, next) {
  let propertyData = req.body;
  if (propertyData.price !== undefined) propertyData.price = +propertyData.price;

  propertyData.owner = res.local.user.username;

  const validator = jsonschema.validate(
    propertyData,
    propertyNewSchema,
    { required: true }
  );

  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const key = randomImageName();
  const body = req.files[0].buffer;
  const contentType = req.files[0].mimetype;

  await uploadImg(key, body, contentType);
  const imageUrl = getImgUrl(key);

  propertyData.imageUrl = imageUrl;

  const property = await Property.create(propertyData);
  return res.status(201).json({ property });
});

/** test for making sure aws works */
router.post("/image", upload.single("image"), async function (req, res, next) {
  const file = req.file;
  console.log(file);
  console.log("REQ BODY", req.body);
  const buffer = file.buffer;

  const key = randomImageName();
  const body = req.file.buffer;
  const contentType = req.file.mimetype;

  await uploadImg(key, body, contentType);

  const imageUrl = getImgUrl(key);

  //caption: req.body.caption, imageName

  // has filename, path, destination, etc

  // const description = req.body.description;
  return res.json({ imageUrl });
});

/** GET /  =>
 *   { properties: [ { name, address, imageUrl, owner, price }, ...] }
 *
 * Can filter on provided search filters:
 * - name
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const validator = jsonschema.validate(
    req.query,
    propertySearchSchema,
    { required: true }
  );

  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const properties = await Property.findAll(req.query);
  return res.json({ properties });
});

/** GET /[name]  =>  { property }
 *
 *  Property is { { name, address, imageUrl, owner, price, bookings } }
 *    where bookings is [{ id, dateBooked, startDate, endDate, booker }, ...]
 *
 * Throws NotFoundError if not found.
 *
 * Authorization required: none
 */

router.get("/:name", async function (req, res, next) {
  const property = await Property.get(req.params.name);
  return res.json({ property });
});

/** PATCH /[name] { fld1... }, image file => { property }
 *
 * Patches property data.
 *
 * fields can be: { address, price }, image file
 *
 * Returns { name, address, imageUrl, owner, price }
 *
 * Authorization required: correct user
 */

router.patch("/:name",
  upload.array("image", 3),
  ensureCorrectUser,
  async function (req, res, next) {
    let propertyData = req.body;
    if (propertyData.price !== undefined) propertyData.price = +propertyData.price;

    const validator = jsonschema.validate(
      propertyData,
      propertyUpdateSchema,
      { required: true }
    );

    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { imageUrl } = await Property.get(req.params.name);
    deleteImg(imageUrl);

    const key = randomImageName();
    const body = req.files[0].buffer;
    const contentType = req.files[0].mimetype;

    await uploadImg(key, body, contentType);
    const newImageUrl = getImgUrl(key);

    propertyData.imageUrl = newImageUrl;

    const property = await Property.update(req.params.name, propertyData);
    return res.json({ property });
  });

module.exports = router;