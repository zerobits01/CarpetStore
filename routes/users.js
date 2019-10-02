var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var Map = require("../models/Map");
var Carpet = require("../models/Carpet");

/**
 * router middleware for jwt auth
 * */

router.use(function(req, res, next) {
	let token = req.headers["pgr-token"];
	if (token) {
		jwt.verify(token, "pgr0101secret", (err, decoded) => {
			if (err) {
				res.status(403).json({
					msg: "Token is not valid"
				});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.status(403).json({
			msg: "Access denied"
		});
	}
});

/* GET users listing. */
router.get("/", function(req, res) {
	// TODO : profile handling
	//  returning all the carpets s/he added
	res.json({
		msg: "all the carpets"
	});
});

router.post("/newcarpet", function(req, res) {
	Carpet.newCarpet(
		req.body.matrix,
		req.body.price,
		req.body.count,
		req.body.name,
		(err, carpet) => {
			if (err) {
				console.log(err);
				res.status(406).json({
					msg: "something went wrong",
					err: err
				});
			} else {
				res.status(200).json({
					msg: "successful",
					carpet: carpet
				});
			}
		}
	);
});

router.post("/filter", function(req, res) {
	Carpet.filter(
		req.body._id,
		req.body.name,
		req.body.price,
		req.body.count,
		(err, carpet) => {
			if (err) {
				res.status(406).json({
					msg: "bad input",
					err: err
				});
			} else {
				res.json({
					msg: "saved successfully"
				});
			}
		}
	);
});

router.get("/", async function(req, res) {
	console.log(req);
	let carpets = await Carpet.findAll();
	if (!carpets) {
		res.json({
			msg: "no carpets exists"
		});
	} else {
		console.log(carpets[0]);
		res.json({
			msg: "found carpets",
			carpets: carpets
		});
	}
});

module.exports = router;
