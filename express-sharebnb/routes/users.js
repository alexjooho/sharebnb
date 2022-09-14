"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

const router = express.Router();

/** GET /[username]/bookings => { user }
 *
 * Returns { username, firstName, lastName, email, bookings }
 *   where bookings { date_booked, start_date, end_date, property_name }
 *
 * Authorization required: same user-as-:username
 **/

router.get("/:username/bookings",
  ensureCorrectUser,
  async function (req, res, next) {
    const user = await User.getBookings(req.params.username);
    return res.json({ user });
  });


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, properties }
 *   where properties { name, address, image_url, price }
 *
 * Authorization required: user
 **/

router.get("/:username",
  async function (req, res, next) {
    const user = await User.get(req.params.username);
    return res.json({ user });
  });

/** POST /[username]/book
 *
 * field data: { startDate, endDate, propertyName }
 *
 * Returns {"booked": propertyName}
 *
 * Authorization required: same-user-as-:username
 * */

router.post("/:username/book", ensureCorrectUser, async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    bookingNewSchema,
    { required: true }
  );

  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const { propertyName, startDate, endDate } = req.body;

  await User.bookingProperty(req.params.username, propertyName, startDate, endDate);
  return res.json({ booked: propertyName });

});

module.exports = router;