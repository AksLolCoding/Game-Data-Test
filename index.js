//setup basic imports (and setup app)
const express = require("express");
const app = express();
app.use(require("cookie-parser")());
app.use(require("express-session")({
	secret: "abc123", //this is not real
	saveUninitialized: true,
	cookie: {httpOnly: true},
	resave: false,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.static("public"));

//App
costs = [0, 5, 10, 25, 75, 200, 500, 1250, 5000, 0];
earns = [0, 1, 3, 5, 12, 25, 75, 150, 500, 0];

function earn(level){
	let average = earns[level];
	let range = (2 * average) / 5;
	return Math.round((Math.random() * range) + (range * 2.5));
}

function getGameData(session){
	return {
		earn: session.earn,
		total: session.total,
		level: session.level,
		cost: costs[session.level],
	};
}

//note: ALL user data is stored in the session
app.get('/', function(req, res){
	req.session.earn = 1;
	req.session.total = 0;
	req.session.level = 1;
	req.session.cooldown = Date.now();
	res.render("index.html");
}); // this is unessecary, ejs does this for us

app.post('/api/upgrade', function(req, res){
	if (req.session.total >= costs[req.session.level]){
		req.session.total -= costs[req.session.level];
		req.session.level += 1;
		req.session.earn = earns[req.session.level];
		res.send(getGameData(req.session));
	} else res.sendStatus(400);
});

app.post('/api/earn', function(req, res){
	if (Date.now() > req.session.cooldown){
		req.session.total += earn(req.session.level);
		req.session.cooldown = Date.now() + 1000;
		res.send(getGameData(req.session));
	} else res.sendStatus(400);
});

app.get('/api/game', function(req, res){
	res.send(getGameData(req.session));
});

/*app.post('/api/set', function(req, res){
	req.session.earn = req.query.earn;
	req.session.total = req.query.total;
	req.session.level = req.query.level;
	res.send(getGameData(req.session));
});*/ //this would allow hacking so don't do it

app.listen(1234);