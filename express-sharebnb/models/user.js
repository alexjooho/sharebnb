
const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */
class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email
           FROM users
           WHERE username = $1`,
      [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email}
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
    { username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
      `SELECT username
         FROM users
         WHERE username = $1`,
      [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
         (username,
          password,
          first_name,
          last_name,
          email)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING username, first_name AS "firstName", last_name AS "lastName", email`,
      [
        username,
        hashedPassword,
        firstName,
        lastName,
        email
      ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Given a username, return data about user.
     *
     * Returns { username, first_name, last_name, email, properties}
     *   where properties is [{ name, address, imageUrl, price },...]
     *
     * Throws NotFoundError if user not found.
     **/

  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
                first_name AS "firstName",
                last_name AS "lastName",
                email
         FROM users
         WHERE username = $1`,
      [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userPropertiesRes = await db.query(
      `SELECT p.name, p.address, p.image_url AS "imageUrl", p.price
         FROM properties AS p
         WHERE p.owner = $1`, [username]);

    user.properties = userPropertiesRes.rows;
    return user;
  }

  /** Given a username, return data about user and their bookings.
     *
     * Returns { username, first_name, last_name, email, bookings}
     *   where bookings is:
     *   [{ date_booked, start_date, end_date, property_name },...]
     *
     * Throws NotFoundError if user not found.
     **/

  static async getBookings(username) {
    const userRes = await db.query(
      `SELECT username,
                first_name AS "firstName",
                last_name AS "lastName",
                email
         FROM users
         WHERE username = $1`,
      [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userBookingsRes = await db.query(
      `SELECT date_booked AS "dateBooked",
        start_date AS "startDate",
        end_date AS "endDate",
        property_name AS "propertyName"
         FROM bookings
         WHERE booker = $1`, [username]);

    user.bookings = userBookingsRes.rows;
    return user;
  }

  /** Book a property: update db, returns undefined.
     *
     * - username: username booking a property
     * - propertyName: property name
     **/

  static async bookingProperty(username, propertyName, startDate, endDate) {
    const preCheckProperty = await db.query(
      `SELECT name
         FROM properties
         WHERE id = $1`, [propertyName]);
    const property = preCheckProperty.rows[0];

    if (!property) throw new NotFoundError(`No property: ${propertyName}`);


    const preCheckBooking = await db.query(
      `SELECT id
      FROM bookings
      WHERE property_name = $1 AND NOT (start_date > $2 OR end_date < $3)`,
      [propertyName, endDate, startDate]);

    const booking = preCheckBooking.rows[0];

    if (booking) throw new BadRequestError(`${propertyName} already booked for date`);

    const preCheckUser = await db.query(
      `SELECT username
         FROM users
         WHERE username = $1`, [username]);
    const user = preCheckUser.rows[0];

    if (!user) throw new NotFoundError(`No username: ${username}`);

    await db.query(
      `INSERT INTO bookings (
          date_booked,
          start_date,
          end_date,
          booker,
          property_name)
         VALUES ($1, $2, $3, $4, $5)`,
      [current_timestamp, startDate, endDate, username, propertyName]);
  }

}

module.exports = User;