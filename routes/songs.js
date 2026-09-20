/** Express router providing song related routes
 * @module routes/songs
 * @requires express
 */

const Song = require("../models/song");
const bcrypt = require("bcrypt");
const express = require("express");
const continueIfValidSong = require("../validators/songValidator");
const { ensureLoggedIn, authenticateJWT } = require("../middleware/auth");

/**
 * Express router to mount song related functions on.
 * @type {object}
 * @const
 * @namespace songs
 */
const router = new express.Router();

/**
 * Route for getting all songs from the database.
 * @return {Array} Array of song objects (each object containing id, name, url, code, display_order, show_on_site, category)
 */
router.get("/", async function (req, res, next) {
	try {
		const songs = await Song.findAll();
		console.log("songs: ", songs);
		return res.json(songs);
	} catch (e) {
		return next(e);
	}
});

/**
 *  Edit a song's basic information
 * @return {Object} Object containing the result of the update
 */
router.patch("/", ensureLoggedIn, async function (req, res, next) {
	try {
		// continueIfValidEdit(req, next);
		console.log("req.body", req.body);
		console.log("req.query", req.query);
		const resp = await Song.updateSong(req.body, req.query.songID);
		console.log("resp:", resp);
		return res.json(resp);
	} catch (e) {
		return next(e);
	}
});

/**
 *  Adds a new song
 * @return {Object} Object containing success message
 */
router.post("/", ensureLoggedIn, async function (req, res, next) {
	try {
		continueIfValidSong(req, next);
		// const { venueID, date, time, ticket_link } = req.body;
		const resp = await Song.create(req.body);
		return res.json(resp);
	} catch (e) {
		return next(e);
	}
});

router.delete("/", authenticateJWT, async function (req, res, next) {
	try {
		console.log("req.body: ", req.body);
		const resp = await Song.delete(req.body.songID);
		return res.json(resp);
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
