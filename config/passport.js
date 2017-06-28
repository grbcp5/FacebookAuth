var LocalStrategy = require( 'passport-local' ).Strategy;
var FacebookStrategy = require( 'passport-facebook' ).Strategy;
var User = require( '../app/models/user.js' );

module.exports = function( passport, auth ) {

  passport.serializeUser( function( user, done ) {
    done( null, user.id );
  } );

  passport.deserializeUser( function( id, done ) {
    User.findById( id, function( err, user ) {
      done( err, user );
    } );
  } );

  passport.use( 'local-signup', new LocalStrategy( {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function( req, email, password, done )   {
    process.nextTick( function() {

      User.findOne( { 'local.username': email }, function( err, user ) {
        if( err )
          return done( err, null );
        else if( user )
          return done( null, false, req.flash( 'signupMessage', 'That email already exists' ) );
        else {
          var newUser = new User();
          newUser.local.username = email;
          newUser.local.password = password;
          newUser.save( function( err ) {
            if( err )
              throw err;
            return done( null, newUser );
          } );
        }
      } );

    } ); // process.nextTick()
  } ) ); // passport local strategy callback

  passport.use( 'local-login', new LocalStrategy( {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function( req, email, password, done ) {
    process.nextTick( function() {
      User.findOne( { 'local.username': email }, function( err, user ) {
        if( err )
          return done( err, null );
        if( !user )
          return done( null, false, req.flash( 'loginMessage', 'No user with that email exists.' ) );
        else {
          if( user.local.password !== password )
            return done( null, false, req.flash( 'loginMessage', 'Password does not match.' ) );
          else
            return done( null, user );
        }
      } );
    } );
  } ) );

  passport.use(new FacebookStrategy({
      clientID: auth.facebookAuth.clientID,
      clientSecret: auth.facebookAuth.clientSecret,
      callbackURL: auth.facebookAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick( function () {

        User.findOne( { 'facebook.id': profile.id }, function( err, user ) {
          if( err )
            return done( err, null );
          else if( user )
            return done( null, user );
          else {
            var newUser = new User();

            newUser.facebook.id = profile.id;
            newUser.facebook.accessToken = accessToken;
            newUser.facebook.refreshToken = refreshToken;
            newUser.facebook.name = profile.displayName;

            newUser.save( function( err ) {
              if( err )
                throw err;

              console.log( profile );
              return done( null, newUser );
            } );

          }
        } );

      } );
    } ) );

};