"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

const bookingNewSchema = require("../schemas/bookingNew.json");

const router = express.Router();

/** GET /[username]/bookings => { user }
 *
 * Returns { username, firstName, lastName, email, bookings }
 *   where bookings [{ dateBooked, startDate, endDate, propertyNam }, ...]
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
 *   where properties { name, address, imageUrl, price }
 *
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
    
    if(Date.parse(startDate) > Date.parse(endDate)) {
        throw new BadRequestError("Start date must be before end date you dummy");
    }

    await User.bookingProperty(req.params.username, propertyName, startDate, endDate);
    return res.json({ booked: propertyName });

});

module.exports = router;