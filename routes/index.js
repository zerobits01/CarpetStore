var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Carpet = require("../models/Carpet");
var jwt = require("jsonwebtoken");
var Path = require("path");
var Carpet = require("../models/Carpet");
var Map = require("../models/Map");

router.post("/register", function(req, res) {
	console.log(req.body);
	let userDoc = new User({
		email: req.body.email,
		password: req.body.password
	});
	User.register(userDoc, function(err, user) {
		if (err) {
			console.log(err);
			res.status(406).json({
				msg: "error",
				errors: err
			});
		} else {
			let token = jwt.sign(
				{
					email: req.body.email
				},
				"pgr0101secret",
				{
					expiresIn: "24h"
				}
			);
			res.json({
				msg: "successful",
				token: token,
				user: user
			});
		}
	});
});

router.post("/login", async function(req, res) {
	let answer = await User.authenticate(req.body.email, req.body.password);
	if (answer) {
		let token = jwt.sign(
			{
				email: req.body.email
			},
			"pgr0101secret",
			{
				expiresIn: "24h"
			}
		);
		res.json({
			msg: "loggedin",
			token: token
		});
	} else {
		res.status(406).json({
			msg: "wrong"
		});
	}
});

router.get("/static/:name", async function(req, res) {
	let p = __dirname + "/../" + "/public/" + "/carpets/" + req.params.name;
	let path = Path.normalize(p);
	res.sendFile(path);
});

router.get("/bywithmoney/:money", async function(req, res) {
	let answer = await Carpet.recommendCarpet(parseInt(req.params.money));
	res.json({
		msg: "recommending carpets with limited money",
		answer: answer
	});
});

router.get("/mapsme/:location", async function(req, res) {
	try {
		let location = parseInt(req.params.location);
		let router = await Map.mapsMe(location);
		res.json({
			msg: "routing the user to the nearest Store",
			router: router
		});
	} catch (e) {
		console.log(e);
		res.status(406).json({
			msg: "bad input"
		});
	}
});

router.get("/", async function(req, res) {
	let carpets = await Carpet.findAll();
	if (!carpets) {
		console.log(carpets);
		res.json({
			msg: "no carpets exists"
		});
	} else {
		res.json({
			msg: "found carpets",
			carpets: carpets
		});
	}
});

router.get("/carpetcomplete/:_id", async function(req, res) {
	let carpet = await Carpet.findById(req.params._id);
	if (carpet) {
		res.json({
			msg: "found",
			carpet: carpet
		});
	} else {
		res.status(406).json({
			msg: "not found"
		});
	}
});

router.post("/countcarpet", async function(req, res) {
	try {
		await Carpet.countCarpets(req.body._id, req.body.count, function(err, carpet) {
			if (err) {
				res.status(406).json({
					msg: "something went wrong",
					err: err
				});
			} else {
				res.status(200).json({
					msg: "something went wrong",
					carpet: carpet
				});
			}
		});
	} catch (e) {
		console.log(e);
		res.status(406).json({
			msg: "something went wrong",
			err: e
		});
	}
});

router.post("/ratecarpet", async function(req, res) {
	console.log(req.body);
	try {
		await Carpet.rateCarpet(req.body._id, req.body.rate, function(err, carpet) {
			if (err) {
				console.log(err);
				res.status(406).json({
					msg: "something went wrong",
					err: err
				});
			} else {
				res.status(200).json({
					msg: "something went wrong",
					carpet: carpet
				});
			}
		});
	} catch (e) {
		res.status(406).json({
			msg: "something went wrong",
			err: e
		});
	}
});

module.exports = router;
