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
  console.log(req.body);
  var queryString = "select max(id) from track where true;";
  dbclient.query(queryString, function(err, results, fields) {
    var queryString = "INSERT INTO track (id, name, country, scene, style, mood, artist, year, file) VALUES(";
    queryString += (results[0]["max(id)"] + 1).toString() + ", ";
    queryString += '\"' + req.body["name"] + '\", ';
    queryString += '\"';
    if (typeof(req.body["district"]) != 'undefined') {
      for (var i = 0; i < req.body["district"].length; i++)
        queryString += req.body["district"][i] + ';';
    }
    queryString += '\", ';
    queryString += '\"';
    if (typeof(req.body["scene"]) != 'undefined') {
      for (var i = 0; i < req.body["scene"].length; i++)
        queryString += req.body["scene"][i] + ';';
    }
    queryString += '\", ';
    queryString += '\"';
    if (typeof(req.body["style"]) != 'undefined') {
      for (var i = 0; i < req.body["style"].length; i++)
        queryString += req.body["style"][i] + ';';
    }
    queryString += '\", ';
    queryString += '\"';
    if (typeof(req.body["mood"]) != 'undefined') {
      for (var i = 0; i < req.body["mood"].length; i++)
        queryString += req.body["mood"][i] + ';';
    }
    queryString += '\", ';
    queryString += '\"' + req.body["artist"] + '\", ';
    if (typeof(req.body["year"]) != 'undefined')
      queryString += req.body["year"].toString() + ", ";
    else
      queryString += '0';
    queryString += '\"' + req.body["file"] + '\");';

    console.log(queryString);
    dbclient.query(queryString, function(err, results, fields) {
      if (err)
        res.json({"state":false});
      else
        res.json({"state":true});
    });
  });
});

app.post('/sltTrack', function(req, res) {
  console.log("===========================================");
  console.log(req.body);
  console.log("===========================================");
  var flag = 0;
  var queryString = 'select id, name, year, artist from track where ';
  if (req.body['name'] != '') {
    if (flag == 1)
      queryString += ' and ';
    else
      flag = 1;
    queryString += 'name REGEXP "' + req.body['name'] + '"';
  }
  if (req.body['year'] != '') {
    if (flag == 1)
      queryString += ' and ';
    else
      flag = 1;
    queryString += 'year = ' + req.body['year'];
  }
  if (req.body['artist'] != '') {
    if (flag == 1)
      queryString += ' and ';
    else
      flag = 1;
      queryString += 'artist REGEXP ""' + req.body['artist'] + '"';
  }
  if (req.body.hasOwnProperty("district")) {
    for (var i = 0; i < req.body['district'].length; i++) {
      if (flag == 1)
        queryString += ' and ';
      else
        flag = 1;
      queryString += 'country REGEXP "' + req.body['district'][i] + '"';
    }
  }
  if (req.body.hasOwnProperty("scene")) {
    for (var i = 0; i < req.body['scene'].length; i++) {
      if (flag == 1)
        queryString += ' and ';
      else
        flag = 1;
      queryString += 'scene REGEXP "' + req.body['scene'][i] + '"';
    }
  }
  if (req.body.hasOwnProperty("style")) {
    for (var i = 0; i < req.body['style'].length; i++) {
      if (flag == 1)
        queryString += ' and ';
      else
        flag = 1;
      queryString += 'style REGEXP \'' + req.body['style'][i] + '\'';
    }
  }
  if (req.body.hasOwnProperty("mood")) {
    for (var i = 0; i < req.body['mood'].length; i++) {
      if (flag == 1)
        queryString += ' and ';
      else
        flag = 1;
      queryString += 'mood REGEXP "' + req.body['mood'][i] + '"';
    }
  }
  if (!flag)
    queryString += "true";
  queryString += ';';
  console.log(queryString);
  dbclient.query(queryString, function(err, results, fields) {
    if (err) {
      res.send({});
    }
    else {
      res.send(results);
    }
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
