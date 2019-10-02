let mongoose = require("mongoose");
let rootpath = "E:/Programming/CarpetStore/public/carpets";
let { PythonShell } = require("python-shell");
let Path = require("path");

let db = mongoose.connection.on("connect", function() {
	console.log("connected to mongodb");
});

let carpetSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},

	imgsrc: {
		type: String,
		require: true
	},

	path: {
		type: String,
		required: true
	},

	price: {
		type: Number,
		required: true
	},

	rate: {
		type: Number
	},

	count: {
		type: Number
	}
});

let Carpet = mongoose.model("Carpet", carpetSchema);
module.exports = Carpet;

module.exports.recommendCarpet = async function(cash) {
	let carpets = await Carpet.find({}).sort({ price: 1 });
	let answer = {}; // dict of => count : carpet
	try {
		carpets.forEach(carpet => {
			let cnt = carpet.count;
			let price = carpet.price;
			if (cash < price) {
				throw "err";
			} else {
				let i = 1;
				while (true) {
					if (i * price > cash || i > cnt) {
						i--;
						break;
					}
					i++;
				}
				cash -= i * price;
				answer[carpet.name] = i;
			}
		});
	} catch (e) {
		console.log(e);
	}

	return answer;
};

module.exports.newCarpet = function(matrix, price, count, name, cb) {
	filepath = rootpath + "/" + name + ".png";
	let data = {
		fpath: filepath,
		type: "new",
		matrix: matrix
	};
	data = JSON.stringify(data);
	let p =
		__dirname + "/../" + "/helpers/" + "/image-proccessing/" + "image_manipulate.py";
	let script = Path.normalize(p);
	let opt = {
		mode: "text",
		pythonOptions: ["-u"],
		args: [data],
		pythonPath: "D:\\Vritual env\\data_env\\Scripts\\python.exe"
	};
	PythonShell.run(script, opt, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			let imgsrc = "http://172.17.40.148:3000" + "/static/" + name + ".png";
			let carpet = new Carpet({
				path: filepath,
				price: price,
				count: count,
				imgsrc: imgsrc,
				name: name,
				rate: 0
			});
			carpet.save(cb);
		}
	});
};

module.exports.filter = function(_id, name, price, count, cb) {
	Carpet.findById(_id, (err, ocarpet) => {
		let opath = ocarpet.path;
		let npath = rootpath + "/" + name + ".png";
		let data = {
			opath: opath,
			npath: npath,
			type: "filter"
		};
		data = JSON.stringify(data);
		let p =
			__dirname +
			"/../" +
			"/helpers/" +
			"/image-proccessing/" +
			"image_manipulate.py";
		let script = Path.normalize(p);
		let opt = {
			mode: "text",
			pythonOptions: ["-u"],
			args: [data],
			pythonPath: "D:\\Vritual env\\data_env\\Scripts\\python.exe"
		};
		PythonShell.run(script, opt, (err, data) => {
			if (err) {
				console.log(err);
			} else {
				let imgsrc = "http://172.17.40.148:3000" + "/static/" + name + ".png";
				let newcarpet = new Carpet({
					path: npath,
					price: price,
					count: count,
					imgsrc: imgsrc,
					name: name,
					rate: 0
				});
				newcarpet.save(cb);
			}
		});
	});
};

module.exports.countCarpets = async function(_id, count, cb) {
	let carpet = await Carpet.findOne({ _id: _id });
	if (carpet.count + count < 0) {
		throw "count can't be negative";
		return;
	} else {
		let carpet = await Carpet.findOne({ _id: _id });
		carpet.count += parseInt(count);
		carpet.save(cb);
	}
};

module.exports.rateCarpet = async function(_id, rate, cb) {
	if (rate < 0) {
		throw "rate shouldn't be negative";
		return;
	} else {
		let carpet = await Carpet.findOne({ _id: _id });
		carpet.rate = (carpet.rate + parseFloat(rate)) / 2;
		carpet.save(cb);
	}
};

module.exports.findAll = async function() {
	let carpets = await Carpet.find({});
	return carpets;
};
