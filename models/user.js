const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR, SECRET_KEY, DB_URI } = require("../config");
const { default: axios } = require("axios");
const convertDate = require("../helpers/convertDate");
const { getUserBookmarks, getUserEatenMeals } = require("../helpers/userModel");
const ExpressError = require("../expressError");

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
class User {
	/**
	 *  Inserts a new user into the database with hashed password
	 * @param {Object} (contains username, email, first_name, last_name, weight, weight_goal, calorie_goal)
	 * @return {Object} User object (contains username, email, first_name, last_name, weight, weight_goal, calorie_goal)
	 */
	static async register({ username, password, first_name, last_name }) {
		const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		let insertSql =
			"INSERT INTO users (username, password, first_name, last_name) VALUES ";
		insertSql += `('${username}', '${hashedPwd}', '${first_name}', '${last_name}')`;
		// sql += "SELECT * FROM users WHERE id = LAST_INSERT_ID();";
		connect();
		await db.promise().query(insertSql);

		let selectSql = "SELECT * FROM shows WHERE id = LAST_INSERT_ID()";
		connect();
		const result = await db.promise().query(selectSql);
		const user = results[0];
		return user;
	}

	/**
	 *  Checks that the passed username & password correlate to a username & hashed password
	 * 				from the users table.
	 * @param {String} username the username that the user has entered in to the login form
	 * @param {String} password the password that the user has entered in to the login for
	 * @return {Object} User object (contains username, email, first_name, last_name, weight, weight_goal, calorie_goal, * 					bookmarks, eatenMeals)
	 */
	static async authenticate(username, password) {
		let sql = `SELECT * FROM users WHERE username='${username}'`;
		connect();
		const result = await db.promise().query(sql);
		if (result[0].length === 1) {
			const user = result[0][0];
			// console.log(user);
			if (await bcrypt.compare(password, user.password)) {
				// console.log(user);
				delete user.password;
				return user;
			}
		}
		return false;
	}

	/**
	 *  Finds and returns all users from the database.
	 * @return {Array} Array of user objects (each object containing username, email, first_name, last_name)
	 */
	static async findAll() {
		connect();
		const userRes = await db.query(
			`
            SELECT username,
                email,
                first_name,
                last_name
            FROM users
            ORDER BY username;
        `
		);

		return userRes.rows;
	}

	/**
	 *  Finds a user from the databse with a given username
	 * @param {String} username The username of the user that we are trying to find
	 * @return {Object} Object containing username, email, first_name and last_name of the found user
	 */
	static async findOne(username) {
		connect();
		const userRes = await db.query(
			`
            SELECT username,
                email,
                first_name,
                last_name
            FROM users 
            WHERE username=$1
            `,
			[username]
		);

		const user = userRes.rows[0];
		if (!user) {
			throw new ExpressError("User not found", 404);
		}
		user.bookmarks = await getUserBookmarks(db, username);
		user.eatenMeals = await getUserEatenMeals(db, username);
		return user;
	}

	/**
	 *  Edit a user's basic information
	 * @param {Object} data Contains the new email, first_name, last_name, weight, weight_goal and calorie_goal
	 * @param {String} username The username of the user that we are trying to edit
	 * @return {Object} Object containing username, email, first_name, last_name, weight, weight_goal, calorie_goal, *   *     				bookmarks and eatenMEals of the editted user
	 */
	static async editProfile(data, username) {
		connect();
		let query = "";
		let count = 1;

		Object.keys(data).map((key, idx) => {
			query += `${key}=$${count}`;
			idx === Object.keys(data).length - 1 ? (query += " ") : (query += ", ");
			count++;
		});

		const userRes = await db.query(
			`
			UPDATE users
			SET ${query}
			WHERE username=$${count}
			RETURNING username, email, first_name, last_name, weight, weight_goal, calorie_goal
			`,
			[...Object.values(data), username]
		);

		const user = userRes.rows[0];
		return user;
	}

	/**
	 * Removes a user and all of their bookmarks and eaten meals from the deatabase
	 * @param {String} username
	 * @returns success message upon deletion
	 */
	static async deleteUser(username) {
		connect();
		await db.query(
			`
			DELETE FROM users_meals WHERE username=$1
		`,
			[username]
		);
		connect();
		await db.query(
			`
			DELETE FROM bookmarks WHERE username=$1
		`,
			[username]
		);
		connect();
		await db.query(
			`
			DELETE FROM users WHERE username=$1
		`,
			[username]
		);
		return { message: "User deleted" };
	}

	/**
	 * Searches the database for a user with an email/username (keyword) with a given value (value)
	 * @param {String} keyword - either "username" or "email"
	 * @param {String} value - the value of the username/email that we are checking
	 * @returns the user that was found, or undefined if there was no user found
	 */
	static async isFieldTaken(keyword, value) {
		connect();
		const results = await db.query(`SELECT * FROM users WHERE ${keyword}=$1`, [
			value,
		]);
		return results.rows[0];
	}
}

module.exports = User;
