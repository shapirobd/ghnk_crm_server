const { db, connect } = require("../db");
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
class Album {
	/**
	 *  Finds and returns all users from the database.
	 * @return {Array} Array of user objects (each object containing username, email, first_name, last_name)
	 */
	static async findAll() {
		const sql = "SELECT id, name, url, code FROM albums ORDER BY id";
		connect();
		const results = await db.promise().query(sql);
		console.log("album results: ", results[0]);
		return results[0];
	}

	/**
	 *  Finds and returns all users from the database.
	 * @param {Object} data Contains required info to create a show
	 * @return {Array} Array of user objects (each object containing username, email, first_name, last_name)
	 */
	static async create(data) {
		let { name, url, code } = data;

		let columns = `(name, url, code)`;
		let values = `('${name}', '${url}', '${code}')`;
		const sql = `INSERT INTO albums ${columns} VALUES ${values}`;
		console.log(sql);

		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}

	static async delete(albumID) {
		console.log(albumID);
		let sql = "DELETE FROM albums WHERE id = " + albumID;
		console.log(sql);
		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}

	static async updateAlbum(data, albumID) {
		let { name, url, code } = data;

		console.log("code", code);
		let columns = ["name", "url", "code"];
		let values = [`'${name}'`, `'${url}'`, `'${code}'`];

		let sql = "UPDATE albums SET ";
		let valuesString = "";

		for (let i = 0; i < columns.length; i++) {
			valuesString = valuesString + (valuesString.length ? ", " : "");
			valuesString += `${columns[i]} = ${values[i]}`;
		}
		sql += `${valuesString} WHERE id = ${albumID}`;
		connect();
		const results = await db.promise().query(sql);
		console.log("results: ", results[0]);
		return results[0];
	}
}

module.exports = Album;
