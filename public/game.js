import {post, get} from "./api.js";

//init
get('/api/game').then((data) => {
	window.game = data;
	updateGame();
});

function updateGame(){
	document.getElementById("total").innerText = "Total: " + game.total.toString();
	document.getElementById("income").innerText = "Income: >" + game.earn.toString();
	document.getElementById("level").innerText = "Level: " + game.level.toString();
	document.getElementById("cost").innerText = "Upgrade Cost: " + game.cost.toString();
}

//in real life, do not do this, it can be hacked
//update: the uri is now disabled, gives 404
window.set = async (total, earn, level) => {
	let resp = await post(`/api/set?earn=${earn}&total=${total}&level=${level}`);
	if (resp) window.game = resp;
	updateGame();
}

//game inputs
window.e = document.getElementById("earn");
window.u = document.getElementById("upgrade");
e.disabled = false;
u.disabled = true;

e.onclick = async () => {
	let resp = await post('/api/earn');
	if (resp) window.game = resp;
	e.disabled = true;
	updateGame();
	setTimeout(() => {e.disabled = false}, 1001);
	if (game.total >= game.cost) u.disabled = false;
};

u.onclick = async () => {
	let resp = await post('/api/upgrade');
	if (resp) window.game = resp;
	updateGame();
	u.disabled = true;
	if (game.level == 9){
		document.body.innerHTML = `<p>Game Over</p>`;
		alert("Game Over!");
	}
};