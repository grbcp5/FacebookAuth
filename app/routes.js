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


  app.use( '/setMessage', setMessageMiddleware, function( req, res ) {

    User.findOne( { 'facebook.id': req.user.facebook.id } , function( err, user ) {

      if( err || !user ) {
        res.send( "Cannot update message" );
      } else {
        
        user.message = req.body.message;
        user.save( function( err ) {
          if( err )
            throw err;
        } );
        res.redirect( '/profile' );

      }

    } );
  } );

  app.use( '/auth/facebook', shouldAuth, passport.authenticate( 'facebook' ) );

  app.get('/auth/facebook/callback', shouldAuth,
    passport.authenticate('facebook', { successRedirect: '/profile',
      failureRedirect: '/login' } ) );
};



function grantProfileAccess( req, res, next ) {
  if( req.isAuthenticated() ) {
    return next()
  } else {
    res.redirect( '/login' );
  }
}

function shouldAuth( req, res, next ) {
  console.log( "shouldAuth" );
  if( req.isAuthenticated() ) {
    res.redirect( '/profile' );
  } else {
    next();
  }
}

function setMessageMiddleware( req, res, next ) {
  if( req.isAuthenticated() ) {
    next();
  } else {
    res.render( 'login.ejs', { message: req.flash( 'loginMessage', 'You must log in then enter the message you wish to set.' ) } );
  }
}

function proceedToLogin( req, res, next ) {
  if( !req.isAuthenticated() )
    return next();
  else
    res.redirect( '/profile' );
}
