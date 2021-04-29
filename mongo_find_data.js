
var http = require('http');
var fs = require('fs');
var qs = require('querystring');


const { MongoClient } = require('mongodb');

const url = "mongodb+srv://kennedymay:kennedy@hw12.apgde.mongodb.net/?retryWrites=true&w=majority";

const mongo = new MongoClient(url, {useUnifiedTopology: true });

function main()
{
	httpServer = http.createServer(function (req, res) {
		create(req, res);
	}).listen(8080);

}


async function parseNew(pdata, res)
{
		pdata = qs.parse(pdata);

		theQuery = {company:pdata['companyName']};
		theQuery2 = {ticker:pdata['stockTicker']};
	
		await mongo.connect();

		var data = await mongo.db("stock");
		var collection = await data.collection("companies");


		result = await collection.find(theQuery);
	
		result.toArray(function(err, items) {

			if (err) {
				console.log("Error: " + err);
			} else {

				for(i = 0; i < items.length; i++) {
					console.log(i + ": " + items[i].ticker);
					res.write(items[i].company + ", " + items[i].ticker + "<br/>");
				}
			}
		});

		result2 = await collection.find(theQuery2);
		result2.toArray(function(err, items) {

			if (err) {
				console.log("Error: " + err);
			} else {

				for(i = 0; i < items.length; i++) {
					console.log(i + ": " + items[i].company);
					res.write(items[i].company + ", " + items[i].ticker + "<br/>");
				}
			}
				res.end();
		});
}


function create(req, res)
{
	if(req.url == "/")
	{
		file = 'stock_ticker.html';
		fs.readFile(file, function(err, txt) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(txt);
			res.end();
		});
	}
	else if (req.url == "/process")
	{
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("Selected data:<br>");
		pdata = "";
		req.on('data', data => {
			pdata += data.toString();
		});

		req.on('end', ()=> {
			parseNew(pdata, res);
		});

		req.on('close', function(err) {console.log("Here")});
	} else {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("Unknown page request");
		res.end();
	}
}



main();

