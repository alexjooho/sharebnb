"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for properties. */

class Property {
  /** Create a property (from data), update db, return new property data.
   *
   * data should be { name, address, imageUrl, owner, price }
   *
   * Returns { name, address, imageUrl, owner, price }
   *
   * Throws BadRequestError if property already in database.
   * */

  static async create({ name, address, imageUrl, owner, price }) {
    const duplicateCheck = await db.query(
        `SELECT name
           FROM properties
           WHERE name = $1`,
        [name]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate property: ${name}`);

    const result = await db.query(
        `INSERT INTO properties
         (name, address, image_url, owner, price)
           VALUES
             ($1, $2, $3, $4, $5)
           RETURNING name, address, image_url as "imageUrl", owner, price`,
        [
          name,
          address,
          imageUrl,
          owner,
          price
        ],
    );
    const property = result.rows[0];

    return property;
  }

  /** Create WHERE clause for filters, to be used by functions that query
   * with filters.
   *
   * searchFilters (all optional):
   * - name (will find case-insensitive, partial matches)
   *
   * Returns {
   *  where: "WHERE num_employees >= $1 AND name ILIKE $2",
   *  vals: [100, '%Apple%']
   * }
   */

   static _filterWhereBuilder({ name }) {
    let whereParts = [];
    let vals = [];

    if (name) {
      vals.push(`%${name}%`);
      whereParts.push(`name ILIKE $${vals.length}`);
    }

    const where = (whereParts.length > 0) ?
        "WHERE " + whereParts.join(" AND ")
        : "";

    return { where, vals };
  }

  /** Find all properties (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - name (will find case-insensitive, partial matches)
   *
   * Returns [{ name, address, imageUrl, owner, price }, ...]
   * */

   static async findAll(searchFilters = {}) {
    const { name } = searchFilters;

    const { where, vals } = this._filterWhereBuilder({name});

    const propertiesRes = await db.query(`
      SELECT name,
             address,
             image_url as "imageUrl",
             owner,
             price
        FROM properties ${where}
        ORDER BY name
    `, vals);
    return propertiesRes.rows;
  }

  /** Given a property name, return data about property.
   *
   * Returns { name, address, imageUrl, owner, price, bookings}
   *    where bookings is [{ id, dateBooked, startDate, endDate, booker }, ...]
   *
   * Throws NotFoundError if not found.
   **/

   static async get(name) {
    const propertyRes = await db.query(
        `SELECT name,
                address,
                image_url as "imageUrl",
                owner,
                price
           FROM properties
           WHERE name = $1`,
        [name]);

    const property = propertyRes.rows[0];

    if (!property) throw new NotFoundError(`No property: ${name}`);

    const bookingsRes = await db.query(
        `SELECT id,
            date_booked as "dateBooked",
            start_date as "startDate",
            end_date as "endDate",
            booker
           FROM bookings
           WHERE property_name = $1
           ORDER BY start_date`,
        [name],
    );

    property.bookings = bookingsRes.rows;

    return property;
  }

  /** Update property data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { address, imageUrl, owner, price}
   *
   * Returns {name, address, imageUrl, owner, price}
   *
   * Throws NotFoundError if not found.
   */

   static async update(name, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          imageUrl: "image_url"
        });
    const nameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE properties
                      SET ${setCols}
                        WHERE name = ${nameVarIdx}
                        RETURNING name, address, image_url as "imageUrl", owner, price`;
    const result = await db.query(querySql, [...values, name]);
    const property = result.rows[0];

    if (!property) throw new NotFoundError(`No property: ${name}`);

    return property;
  }

  /** Delete given property from database; returns undefined.
   *
   * Throws NotFoundError if property not found.
   **/

   static async remove(name) {
    const result = await db.query(
        `DELETE
           FROM properties
           WHERE name = $1
           RETURNING name`,
        [name]);
    const property = result.rows[0];

    if (!property) throw new NotFoundError(`No property: ${name}`);
  }
}

module.exports = Property;