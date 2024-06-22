const { db, connect } = require("../db");
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
	static async findAll(getVenueNames, forSite) {
		let sql = "";
		let sql_prev = "";
		if (getVenueNames) {
			sql =
				"SELECT s.id, v.name AS venue_name, s.other_artists, s.date, s.time, s.ticket_link, s.is_solo FROM shows s JOIN venues v ON s.venueID = v.id WHERE s.date > (NOW() - INTERVAL 24 HOUR) ORDER BY s.date ASC";
			sql_prev =
				"SELECT s.id, v.name AS venue_name, s.other_artists, s.date, s.time, s.ticket_link, s.is_solo FROM shows s JOIN venues v ON s.venueID = v.id WHERE s.date <= (NOW() - INTERVAL 24 HOUR) ORDER BY s.date DESC";
		} else if (forSite) {
			sql =
				"SELECT v.name AS venue, v.address, v.city, v.state, s.other_artists, s.date, s.time, v.link AS venueLink, s.ticket_link AS ticketLink, s.is_solo AS solo FROM shows s JOIN venues v ON s.venueID = v.id WHERE s.date > (NOW() - INTERVAL 24 HOUR) ORDER BY s.date ASC";
			sql_prev =
				"SELECT v.name AS venue, v.address, v.city, v.state, s.other_artists, s.date, s.time, v.link AS venueLink, s.ticket_link AS ticketLink, s.is_solo AS solo FROM shows s JOIN venues v ON s.venueID = v.id WHERE s.date <= (NOW() - INTERVAL 24 HOUR) ORDER BY s.date DESC";
		} else {
			sql =
				"SELECT id, venueID, other_artists, date, time, ticket_link, is_solo FROM shows s WHERE s.date > (NOW() - INTERVAL 24 HOUR) ORDER BY date ASC";
			sql_prev =
				"SELECT id, venueID, other_artists, date, time, ticket_link, is_solo FROM shows s WHERE s.date <= (NOW() - INTERVAL 24 HOUR) ORDER BY date DESC";
		}
		connect();
		const results = await db.promise().query(sql);
		connect();
		const results_prev = await db.promise().query(sql_prev);
		console.log("results: ", results[0]);
		console.log("results_prev: ", results_prev[0]);
		return { shows : results[0], shows_prev : results_prev[0] };
	}

	/**
	 *  Finds and returns all users from the database.
	 * @param {Object} data Contains required info to create a show
	 * @return {Array} Array of user objects (each object containing username, email, first_name, last_name)
	 */
	static async create(data) {
		let { venueID, date, time, ticket_link, other_artists } = data;

		if (!venueID && data.newVenue) {
			const resp = await Venue.create(data.newVenue);
			venueID = resp[0].id;
		}

		let columns = `(venueID, date, time${ticket_link ? ", ticket_link" : ""}${other_artists ? ", other_artists" : ""})`;
		let values = `(${venueID}, '${date}', '${time}'${ticket_link ? ", '" + ticket_link + "'" : ""}${other_artists ? ", '" + other_artists + "'" : ""})`;
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
	static async delete(showID, setPreviousShow) {
		console.log(showID);
		let backup_sql = `INSERT INTO shows_previous (venueID, date, time, ticket_link, is_solo, other_artists) 
										  (SELECT venueID, date, time, ticket_link, is_solo, other_artists FROM shows WHERE id = ${showID})`;
		let sql = "DELETE FROM shows WHERE id = " + showID;
		console.log(sql);
		if (setPreviousShow) {
			connect();
			const backup_results = await db.promise().query(backup_sql);
			console.log("backup_results: ", backup_results[0]);
		}
		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}

	static async updateShow(data, showID) {
		let { venueID, date, time, is_solo, ticket_link, other_artists } = data;

		if (!venueID && data.newVenue) {
			const resp = await Venue.create(data.newVenue);
			venueID = resp[0].id;
		}
		console.log("venueID", venueID);
		let columns = ["venueID", "date", "is_solo"];
		let values = [venueID, `'${date}'`, is_solo];

		if (ticket_link) {
			columns.push("ticket_link");
			values.push("'" + ticket_link + "'");
		}

		if (time) {
			columns.push("time");
			values.push("'" + time + "'");
		}

		if (other_artists) {
			columns.push("other_artists");
			values.push("'" + other_artists + "'");
		}

		let sql = "UPDATE shows SET ";
		let valuesString = "";

		for (let i = 0; i < columns.length; i++) {
			valuesString = valuesString + (valuesString.length ? ", " : "");
			valuesString += `${columns[i]} = ${values[i]}`;
		}
		sql += `${valuesString} WHERE id = ${showID}`;

		console.log('sql = ', sql);
		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}
}

module.exports = Show;
