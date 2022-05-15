const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { default: axios } = require("axios");
const Venue = require("../models/venue");
// const convertDate = require("../helpers/convertDate");

/**
 *  User model with the following static methods:
 * @method register - inserts new user into database
 * @method authenticate - confirms username & password correspond to user from database
 * @method findAll - gets all users from the database
 * @method findOne - gets one user from the databse (by username)
 * @method editProfile - modifies data on a single user from the database
 * @method bookmarkRecipe - adds a recipe to a user's bookmarks in the database
 * @method unbookmarkRecipe - removes a recipe from a user's bookmarks in the database
 * @method getAllBookmarks - gets all recipes that a single user has bookmarked
 * @method getEatenMeals - gets all recipes that a single user has eaten on a specific date
 * @method addEatenMeal - adds a recipe to a user's eaten meals in the database for a specific date
 * @method removeEatenMeal - removes a recipe from a user's eaten meals in the database for a specific date
 */
class Show {
	/**
	 *  Finds and returns all users from the database.
	 * @return {Array} Array of user objects (each object containing username, email, first_name, last_name)
	 */
	static async findAll(getVenueNames) {
		let sql = "";
		if (getVenueNames) {
			sql =
				"SELECT s.id, v.name AS venue_name, s.date, s.time, s.ticket_link, s.is_solo FROM shows s JOIN venues v ON s.venueID = v.id ORDER BY s.id";
		} else {
			sql = sql =
				"SELECT id, venueID, date, time, ticket_link, is_solo FROM shows ORDER BY id";
		}
		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}

	/**
	 *  Finds and returns all users from the database.
	 * @param {Object} data Contains required info to create a show
	 * @return {Array} Array of user objects (each object containing username, email, first_name, last_name)
	 */
	static async create(data) {
		let { venueID, date, time, ticket_link } = data;

		if (!venueID && data.newVenue) {
			const resp = await Venue.create(data.newVenue);
			venueID = resp[0].id;
		}

		let columns = `(venueID, date, time${ticket_link ? ", ticket_link" : ""})`;
		let values = `(${venueID}, '${date}', '${time}'${
			ticket_link ? ", '" + ticket_link + "'" : ""
		})`;
		const sql = `INSERT INTO shows ${columns} VALUES ${values}`;
		console.log(sql);

		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}

	/**
	 *  Finds and returns all users from the database.
	 * @return {Array} Array of user objects (each object containing username, email, first_name, last_name)
	 */
	static async delete(showID) {
		console.log(showID);
		let sql = "DELETE FROM shows WHERE id = " + showID;
		console.log(sql);
		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}

	static async updateShow(data, showID) {
		let { venueID, date, time, is_solo, ticket_link } = data;

		if (!venueID && data.newVenue) {
			const resp = await Venue.create(data.newVenue);
			venueID = resp[0].id;
		}
		console.log("venueID", venueID);
		let columns = ["venueID", "date", "time", "is_solo"];
		let values = [venueID, `'${date}'`, `'${time}'`, is_solo];

		if (ticket_link) {
			columns.push("ticket_link");
			values.push("'" + ticket_link + "'");
		}

		let sql = "UPDATE shows SET ";
		let valuesString = "";

		for (let i = 0; i < columns.length; i++) {
			valuesString = valuesString + (valuesString.length ? ", " : "");
			valuesString += `${columns[i]} = ${values[i]}`;
		}
		sql += `${valuesString} WHERE id = ${showID}`;
		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}
}

module.exports = Show;
