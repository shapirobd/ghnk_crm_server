/** Express router providing user related routes
 * @module routes/shows
 * @requires express
 */

const Album = require("../models/album");
const bcrypt = require("bcrypt");
const express = require("express");
const continueIfValidAlbum = require("../validators/albumValidator");
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
		console.log("ENTERING GET ALBUMS ROUT");
		const albums = await Album.findAll();
		console.log("albums: ", albums);
		return res.json(albums);
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
		const resp = await Album.updateAlbum(req.body, req.query.albumID);
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
		continueIfValidAlbum(req, next);
		// const { venueID, date, time, ticket_link } = req.body;
		const resp = await Album.create(req.body);
		return res.json(resp);
	} catch (e) {
		return next(e);
	}
});

router.delete("/", authenticateJWT, async function (req, res, next) {
	try {
		console.log("req.body: ", req.body);
		const resp = await Album.delete(req.body.albumID);
		return res.json(resp);
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
