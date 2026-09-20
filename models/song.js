const { db, connect } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { default: axios } = require("axios");
const escape = require("../helpers/escape");
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
class Song {
	/**
	 *  Finds and returns all songs from the database.
	 * @return {Array} Array of song objects (each object containing name, url, code, display_order, show_on_site, category)
	 */
	static async findAll() {
		const sql = "SELECT id, name, url, code, display_order, show_on_site, category FROM songs ORDER BY display_order";
		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}

	/**
	 *  Creates a new song in the database.
	 * @param {Object} data Contains required info to create a song
	 * @return {Array} Array of song objects (each object containing name, url, code, category)
	 */
	static async create(data) {
		let { name, url, code, category } = data;
		category = category || "Single";

		let columns = `(name, url, code, category)`;
		let values = `('${escape(name)}', '${escape(url)}', '${escape(code)}', '${escape(category)}')`;
		const sql = `INSERT INTO songs ${columns} VALUES ${values}`;
		console.log(sql);

		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}

	static async delete(songID) {
		console.log(songID);
		let sql = "DELETE FROM songs WHERE id = " + songID;
		console.log(sql);
		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}

	static async updateSong(data, songID) {
		let { name, url, code, category } = data;

		console.log("code", code);
		let columns = ["name", "url", "code"];
		let values = [`'${escape(name)}'`, `'${escape(url)}'`, `'${escape(code)}'`];

		if (category) {
			columns.push("category");
			values.push(`'${escape(category)}'`);
		}

		let sql = "UPDATE songs SET ";
		let valuesString = "";

		for (let i = 0; i < columns.length; i++) {
			valuesString = valuesString + (valuesString.length ? ", " : "");
			valuesString += `${columns[i]} = ${values[i]}`;
		}
		sql += `${valuesString} WHERE id = ${songID}`;
		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}
}

module.exports = Song;
