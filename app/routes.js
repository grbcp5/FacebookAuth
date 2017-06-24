var User = require( './models/user.js' );

module.exports = function( app, passport ) {

  app.get( '/', function( req, res ) {
    
    res.render( 'index.ejs', { user: req.user } );

  } );

  app.get( '/signup', function( req, res ) {

    res.render( 'signup.ejs', { message: req.flash( 'signupMessage' ) } );

  } );

  app.post('/signup', passport.authenticate( 'local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  } ) );

  app.get( '/profile', grantProfileAccess, function( req, res ) {

    res.render( 'profile.ejs', { user: req.user } );

  } );

  app.get( '/login', proceedToLogin, function( req, res ) {

    res.render( 'login.ejs', { message: req.flash( 'loginMessage' ) } );

  } );

  app.post( '/login', passport.authenticate( 'local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  } ) );

  app.get( '/logout',  function ( req, res ) {
    req.logout();
    res.redirect( '/' );
  } );

};


function grantProfileAccess( req, res, next ) {
  if( req.isAuthenticated() ) {
    return next()
  } else {
    res.redirect( '/login' );
  }
}

function proceedToLogin( req, res, next ) {
  if( !req.isAuthenticated() )
    return next();
  else
    res.redirect( '/profile' );
}