const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { default: axios } = require("axios");
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
class Venue {
	/**
	 *  Finds and returns all users from the database.
	 * @return {Array} Array of user objects (each object containing username, email, first_name, last_name)
	 */
	static async findAll() {
		const sql =
			"SELECT id, name, address, city, state, link FROM venues ORDER BY name ASC";
		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}

	/**
	 *  Finds and returns all users from the database.
	 * @param {Object} data Contains required info to create a venue
	 * @return {Number} New ID from newly inserted venue
	 */
	static async create(data) {
		const { name, address, city, state, link } = data;
		let columns = `(name, address, city, state, link)`;
		let values = `('${name}', '${address}', '${city}', '${state}', '${link}')`;
		const sql = `INSERT INTO venues ${columns} VALUES ${values}`;
		console.log("sql", sql);

		connect();
		const insertResults = await db.promise().query(sql);
		console.log("insertResults: ", insertResults[0]);

		const selectSql = `SELECT id FROM venues WHERE name = '${name}' AND address = '${address}'`;
		connect();
		const selectResults = await db.promise().query(selectSql);
		console.log("selectResults: ", selectResults[0]);
		return selectResults[0];
	}
}

module.exports = Venue;
