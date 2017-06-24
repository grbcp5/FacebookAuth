var express = require( 'express' );
var app = express();

var morgan = require( 'morgan' );
app.use( morgan('dev') );

var cookieParser = require( 'cookie-parser' );
app.use( cookieParser() );

var expressSession = require( 'express-session' );
app.use( expressSession( {
  
  secret: 'anyStringOfText',
  saveUninitialized: true,
  resave: true

} ) );

var configDB = require( './config/database.js' );

var mongoose = require( 'mongoose' );
mongoose.connect( configDB.url );

var port = process.env.PORT || 8080;

var bodyParser = require( 'body-parser' );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.set( 'view engine', 'ejs' );

var passport = require( 'passport' );
app.use( passport.initialize() );
app.use( passport.session() );

var flash = require( 'connect-flash' );
app.use( flash() );

require( './config/passport.js' )( passport );

var routes = require( './app/routes.js' );
routes( app, passport );

app.listen( port );
