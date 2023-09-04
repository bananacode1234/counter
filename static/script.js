const socket = io();
const counter = $("#counter");
const clicks = $("#clicks");

let spaceDown = false;

if (localStorage.getItem("clicks") == null) localStorage.setItem("clicks", "0");

clicks.text(localStorage.getItem("clicks"));

function confirmed() {
	localStorage.setItem("clicks", (parseInt(localStorage.getItem("clicks")) + 1).toString());
	clicks.text(localStorage.getItem("clicks"));
}


$(window).on("click", () => {
    socket.emit("update");
});

$(window).on("keydown", e => {
	if (e.key != " " || spaceDown) return;

	spaceDown = true;
	socket.emit("update");
});

$(window).on("keyup", e => {
	if (e.key != " " || !spaceDown) return;

	spaceDown = false;
});

clicks.dblclick(() => {
	localStorage.setItem("clicks", "0");
	clicks.text(localStorage.getItem("clicks"));
});

socket.on("update", (num) => {
    counter.text(num);
});

socket.on("confirm", () => {
	confirmed();
});

console.time();

socket.emit("ping");

socket.on("pong", console.timeEnd);
