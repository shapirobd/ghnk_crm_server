const jsonschema = require("jsonschema");
const songSchema = require("../schemas/songSchema.json");
const ExpressError = require("../expressError");

function continueIfValidSong(req, next) {
	const result = jsonschema.validate(req.body, songSchema);
	if (!result.valid) {
		const errors = result.errors.map((e) => e.stack);
		return next(new ExpressError(errors, 400));
	}
}

module.exports = continueIfValidSong;
