/** Express router providing user related routes
 * @module routes/shows
 * @requires express
 */

const Single = require("../models/single");
const bcrypt = require("bcrypt");
const express = require("express");
const continueIfValidSingle = require("../validators/singleValidator");
const { ensureLoggedIn, authenticateJWT } = require("../middleware/auth");

/**
 * Express router to mount show related functions on.
 * @type {object}
 * @const
 * @namespace shows
 */
const router = new express.Router();

/**
 * Route for getting all shows from the database.
 * @return {Array} Array of user objects (each object containing id, venueID, date, time, ticket_link, is_solo)
 */
router.get("/", async function (req, res, next) {
	try {
		const singles = await Single.findAll();
		console.log("singles: ", singles);
		return res.json(singles);
	} catch (e) {
		return next(e);
	}
});

/**
 *  Edit a user's basic information
 * @return {Object} Object containing username, email, first_name, last_name, weight, weight_goal, calorie_goal     				bookmarks and eatenMEals of the editted user
 */
router.patch("/", ensureLoggedIn, async function (req, res, next) {
	try {
		// continueIfValidEdit(req, next);
		console.log("req.body", req.body);
		console.log("req.query", req.query);
		const resp = await Single.updateSingle(req.body, req.query.singleID);
		console.log("resp:", resp);
		return res.json(resp);
	} catch (e) {
		return next(e);
	}
});

/**
 *  Adds a recipe id to a user's list of bookmarked recipes
 * @return {Object} Object containing success message with recipeId
 */
router.post("/", ensureLoggedIn, async function (req, res, next) {
	try {
		continueIfValidSingle(req, next);
		// const { venueID, date, time, ticket_link } = req.body;
		const resp = await Single.create(req.body);
		return res.json(resp);
	} catch (e) {
		return next(e);
	}
});

router.delete("/", authenticateJWT, async function (req, res, next) {
	try {
		console.log("req.body: ", req.body);
		const resp = await Single.delete(req.body.singleID);
		return res.json(resp);
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
