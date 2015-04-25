var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');

var app = express();
dbclient = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "travel36512",
  database: "TraMusic"
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/html/main.html");
});

app.get('*.*', function(req, res) {
	var realpath = __dirname + req.path;
	res.sendFile(realpath);
});

app.post('/add', function(req, res) {
  console.log("===============================================");
  console.log(JSON.stringify(req.body));
  console.log("===============================================");

  var queryString = "select max(id) from track where true;";
  dbclient.query(queryString, function(err, results, fields) {
    console.log("===============================================");
    console.log(JSON.stringify(req.body));
    console.log(req.body["district"]);
    console.log(results[0]["max(id)"]);
    console.log("===============================================");
    var queryString = "INSERT INTO track (id, name, country, scene, style, mood, artist, year, file) VALUES(";

    queryString += (results[0]["max(id)"] + 1).toString() + ", ";
    queryString += '\"' + req.body["name"] + '\", ';

    queryString += '\"';

    for (var i = 0; i < req.body["district"].length; i++)
      queryString += req.body["district"][i] + ';';
    queryString += '\", ';

    queryString += '\"';
    for (var i = 0; i < req.body["scene"].length; i++)
      queryString += req.body["scene"][i] + ';';
    queryString += '\", ';

    queryString += '\"';
    for (var i = 0; i < req.body["style"].length; i++)
      queryString += req.body["style"][i] + ';';
    queryString += '\", ';

    queryString += '\"';
    for (var i = 0; i < req.body["mood"].length; i++)
      queryString += req.body["mood"][i] + ';';
    queryString += '\", ';

    queryString += '\"' + req.body["artist"] + '\", ';
    queryString += req.body["year"].toString() + ", ";
    queryString += '\"' + req.body["file"] + '\");';

    dbclient.query(queryString, function(err, results, fields) {
      if (err)
        res.json({"state":false});
      else
        res.json({"state":true});
    });
  });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(2333, function() {
	console.log("Server has started.");
});
