const { Client } = require("pg");
const mysql = require("mysql2");
const { DB_URI } = require("./config");

var db = mysql.createConnection({
	host: process.env.DATABASE_HOST || "localhost",
	port: 3306,
	user: process.env.DATABASE_USERNAME || "root",
	password: process.env.DATABASE_PASSWORD || "potentiate",
	database: process.env.DATABASE_NAME || "ghnk",
});

console.log("process.env.DATABASE_HOST = ", process.env.DATABASE_HOST);
console.log("process.env.DATABASE_USERNAME = ", process.env.DATABASE_USERNAME);
console.log("process.env.DATABASE_PASSWORD = ", process.env.DATABASE_PASSWORD);
console.log("process.env.DATABASE_NAME = ", process.env.DATABASE_NAME);

function connect () {
	db.connect(function (err) {
		// if (err) throw err;
		console.log("Connected!");
	})

	db.on('error', function(err) {
		if (
			err.code === "PROTOCOL_CONNECTION_LOST" ||
			err.code === "ER_ACCESS_DENIED_ERROR"
		) {
			console.log("*****************************");
			db.destroy();
			connect();
		} else {
			throw err;
		}
	})
}

connect();

// let db = new Client({
// 	connectionString: DB_URI,
// });

// db.connect();

module.exports = { db, connect };
