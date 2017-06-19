var User = require( './models/user.js' );

module.exports = function( app ) {

  app.get( '/', function( req, res ) {
    
    res.render( 'index.ejs' );

  } );

  app.get( '/signup', function( req, res ) {

    res.render( 'signup.ejs', { message: 'Please sign up below.' } );

  } );

  app.post('/signup', function( req, res ){

    var newUser = new User();

    newUser.local.username = req.body.email;
    newUser.local.password = req.body.password;

    newUser.save( function(err) {
      if( err )
        throw err;
    } );

    res.redirect('/profile');

  } );

  app.get( '/profile', function( req, res ) {

    res.send( "You have signed up!" );

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

};
