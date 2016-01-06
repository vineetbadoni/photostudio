var express = require('express')
    , routes = require('./server/app/routes/index')
    , user = require('./server/app/routes/user')
    , angularview = require('./server/app/routes/angularview')
    , http = require('http')
    , path = require('path');

var app = express();

var MongoClient = require('mongodb').MongoClient;
var db;

var dbURL = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' + process.env.OPENSHIFT_MONGODB_DB_PASSWORD +
    '@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + process.env.OPENSHIFT_APP_NAME ;
if(process.env.OPENSHIFT_MONGODB_DB_USERNAME || process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    dbURL = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + process.env.OPENSHIFT_APP_NAME ;
}

//var dbURL = "mongodb://localhost:27017/integration_test";

console.log(dbURL);

// Initialize connection once
MongoClient.connect(dbURL, function (err, database) {
    if (err) throw err;

    db = database;

    // Start the application after the database connection is ready
    //app.listen(3000);
    console.log("connected to the DB");
});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');

app.set('views', __dirname + '/client/public/views/app');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use('/', express.static(path.join(__dirname, '/client/public/views/app')));
app.use('/public', express.static(path.join(__dirname, '/client/public')));

console.log(path.join(__dirname, '/client/public'));
//Hooking up the GUIs

//This enables to use ejs files as views
//app.set('view engine', 'ejs');

//This enables the .html files are views
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Hooking up the GUIs

// Development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/angularview', angularview.angularview);

http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});