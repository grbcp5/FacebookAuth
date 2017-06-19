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

var port = process.env.PORT || 8080;

app.use( '/', function( req, res ) {
  
  console.log( req.cookies );
  console.log( "=========" );
  console.log( req.session );

  res.send( "Hello, world!" );

} );

app.listen( port );
