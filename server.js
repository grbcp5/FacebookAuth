var express = require( 'express' );
var app = express();

var morgan = require( 'morgan' );
app.use( morgan('dev') );

var port = process.env.PORT || 8080;

app.use( '/', function( req, res ) {
  
  res.send( "Hello, world!" );

} );

app.listen( port );
