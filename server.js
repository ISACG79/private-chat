const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

//MySQL npm install socket.io mysql
const mysql = require('mysql');
const db = mysql.createConnection({
	connectionLimit: 100,
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'chat2',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
	debug: false
})

// Log any errors connected to the db
function dbConnection(callback) {
	if (db.state == 'disconnected')
		db.connect(function (err) {
			//if (err) console.log("db err :" + err);
			//else console.log('db connected');
			return true;
		})
	if (callback) callback(true);
}
dbConnection()

// Get Database Messages
function getDbMessages(callback) {
	if(callback)
		db.query("SELECT count(id) as c FROM messages", function (error, results, fields) {
			callback(results[0].c);
		});
}

// Create Route
app.get("/", function (req, res, next) {
	res.sendFile(__dirname + "/public/index.html");
});

// Create Database Route
app.get("/database", function (req, res, next) {
	let json;
	db.query("SELECT * FROM messages", function (e) {
		json = JSON.stringify(e);
		res.send(`<h1>All Database</h1><p>${json}</p>`);
	});
});

app.use(express.static("public"));

// On Connection
io.on("connection", function (client) {
	console.log("Client connected...");

	

	// preview File using base64
	client.on('preview-file', function (base64, userid) {
		client.emit("preview_file", base64, userid);
		client.broadcast.emit("preview_file", base64, userid);
	});


	// On Message broadCast it & Saved in DB
	client.on("messages", function (data) {
		client.emit("thread", data);
		client.broadcast.emit("thread", data);
		db.query("INSERT INTO `messages` (`user_from`,`user_to`,`message`,`image`,`base64`) VALUES ('" + data.user_id + "','" + data.user_to + "','" + data.message + "','" + data.image + "','" + data.base64 + "')");
	});

	// On Typing... 
	client.on('is_typing', function (data) {
		if (data.status === true) {
			client.emit("typing", data);
			client.broadcast.emit('typing', data);
		} else {
			client.emit("typing", data);
			client.broadcast.emit('typing', data);
		}
	});

});

server.listen(4320);

module.exports = {server, app, db, dbConnection, getDbMessages}
