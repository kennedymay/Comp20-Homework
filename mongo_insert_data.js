
var fs = require('fs');
const { MongoClient } = require('mongodb');
const url = "mongodb+srv://kennedymay:kennedy@hw12.apgde.mongodb.net/?retryWrites=true&w=majority";
const mongo = new MongoClient(url, { useUnifiedTopology: true }); 

fs.readFile("companies.csv","utf-8", function(err, data) {

	read(err, data);
});

async function read(err, data)
{
	if(err) throw err;
	console.log(data);
	var arr = data.split("\r\n");
	var newData = [];

	var length = arr.length;
	addData(newData, length, arr);

	try {
		console.log("before connecting");
		await mongo.connect();
		console.log("after connecting");

		var data = mongo.db("stock");
		var collection = data.collection("companies");

		await collection.insertMany(newData);
	} finally {
		await mongo.close();
	}

	console.log("Success");

}

function addData(newData, length, arr) {
	for (var i = 1; i < length - 1; i++) {
		var newArr = arr[i].split(",");

		console.log(newData);
		newData.push({"company": newArr[0], "ticker": newArr[1]});
	}
}

