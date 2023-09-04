const fs = require("fs");
const express = require("express");
const { createServer } = require("https");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer({ cert: fs.readFileSync("/etc/letsencrypt/live/counter.bananacode.dev/fullchain.pem"), key: fs.readFileSync("/etc/letsencrypt/live/counter.bananacode.dev/privkey.pem") }, app);
const io = new Server(httpServer);

let count = parseInt(fs.readFileSync("count.txt", "utf-8"));

//fs.writeFileSync("count.txt", "0");

app.use(express.static(__dirname + "/static"));

io.on("connection", socket => {
	socket.emit("update", count.toString());

	socket.on("update", () => {
		socket.emit("confirm");
		count += 1;
		io.emit("update", count.toString());
	});

	socket.on("ping", () => {
		socket.emit("pong");
	});
});

setInterval(() => {
	io.emit("update", count.toString());
	fs.writeFileSync("count.txt", count.toString());
}, 2500);

httpServer.listen(443, () => {
	console.log("Server is online!");
});
