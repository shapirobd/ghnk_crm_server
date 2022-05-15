const jsonschema = require("jsonschema");
const showSchema = require("../schemas/singleSchema.json");
const ExpressError = require("../expressError");

function continueIfValidSingle(req, next) {
	const result = jsonschema.validate(req.body, showSchema);
	if (!result.valid) {
		const errors = result.errors.map((e) => e.stack);
		return next(new ExpressError(errors, 400));
	}
}

module.exports = continueIfValidSingle;
