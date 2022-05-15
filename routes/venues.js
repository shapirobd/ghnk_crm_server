/** Express router providing user related routes
 * @module routes/venues
 * @requires express
 */
const Venue = require("../models/venue");
const bcrypt = require("bcrypt");
const express = require("express");
// const continueIfValidShow = require("../validators/showValidator");
const { ensureLoggedIn, authenticateJWT } = require("../middleware/auth");

/**
 * Express router to mount show related functions on.
 * @type {object}
 * @const
 * @namespace venues
 */
const router = new express.Router();

/**
 * Route for getting all venues from the database.
 * @return {Array} Array of user objects (each object containing id, venueID, date, time, ticket_link, is_solo)
 */
router.get("/", async function (req, res, next) {
	try {
		const venues = await Venue.findAll();
		console.log("venues: ", venues);
		return res.json(venues);
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
		// continueIfValidVenue(req, next);
		const { name, address, city, state, link } = req.body;
		const resp = await Show.create(req.body);
		return res.json(resp);
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
