var mongoose = require( 'mongoose' );

var userScheme = mongoose.Schema( {
  local: {
    username: String,
    password: String
  },
  facebook: {
    id: String,
    accessToken: String,
    refreshToken: String,
    name: String
  },
  message: String
} );

module.exports = mongoose.model( 'User', userScheme );
