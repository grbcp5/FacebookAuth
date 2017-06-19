var User = require( './models/user.js' );

module.exports = function( app ) {

  app.get( '/', function( req, res ) {
    
    res.send( "Hello, world!" );

  } );

  app.get( '/:username/:password', function( req, res ) {

    var userName = req.params.username;
    var password = req.params.password;

    var newUser = new User();
    newUser.local.username = userName;
    newUser.local.password = password;

    console.log( newUser.local.username + " " + newUser.local.password + "." );

    newUser.save( function( err ) {
      if( err )
        throw err;
    } );

    res.send( "Done" );

  } );

}
