/** Express router providing user related routes
 * @module routes/users
 * @requires express
 */

const User = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const continueIfValidEdit = require("../validators/editUserValidator");
const { ensureLoggedIn, authenticateJWT } = require("../middleware/auth");

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 * @namespace users
 */
const router = new express.Router();

/**
 * Route for getting all users from the database.
 * @return {Array} Array of user objects (each object containing username, email, first_name, last_name)
 */
router.get("/", async function (req, res, next) {
	try {
		const users = await User.findAll();
		return res.json(users);
	} catch (e) {
		return next(e);
	}
});

/**
 * Route for finding a user from the databse with a given username
 * @return {Object} Object containing username, email, first_name and last_name of the found user
 */
router.get("/:username", async function (req, res, next) {
	try {
		const user = await User.findOne(req.params.username);
		return res.json(user);
	} catch (e) {
		return next(e);
	}
});

/**
 *  Edit a user's basic information
 * @return {Object} Object containing username, email, first_name, last_name, weight, weight_goal, calorie_goal     				bookmarks and eatenMEals of the editted user
 */
router.patch("/:username", authenticateJWT, async function (req, res, next) {
	try {
		continueIfValidEdit(req, next);
		const resp = await User.editProfile(req.body.data, req.params.username);
		return res.json(resp);
	} catch (e) {
		return next(e);
	}
});

/**
 *  Removes a user from the database
 * @return {Object} Object containing success message
 */
router.delete("/:username", authenticateJWT, async function (req, res, next) {
	try {
		const resp = await User.deleteUser(req.params.username);
		return res.json(resp);
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
