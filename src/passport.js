const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const db = require('../src/databasePool')
const pool = db.getPool()

passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey   : 'SECRET'
},
function (jwtPayload, cb) {

	//find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
	pool.getConnection().then(function(connection) {
		connection.query(`SELECT * FROM user_accounts WHERE user_id = ?`, jwtPayload.id)
		.then(results => {
			// return user
			cb(null, results[0])
		})
		.catch(err => {
			cb(err)
		})
	})
}
))

passport.use('local-login', new LocalStrategy({
	// by default, local strategy uses username and password, we will override with email
	usernameField : 'username',
	passwordField : 'password'
	// passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(username, password, cb) {

	// find a user whose email is the same as the forms email
	// we are checking to see if the user trying to login already exists
	pool.getConnection().then(function (connection) {
		connection.query(`SELECT * FROM user_accounts where username = ?`, username)
		.then(rows => {
			console.log(rows)
			if (!rows.length) {
				return cb(null, false, {message: 'User not found'})
			}
			if (bcrypt.compareSync(password, rows[0].password_hash)) {
				console.log('asd')
				return cb(null, rows[0], {message: 'Logged In Successfully'})
			}
			else {
				return cb(null, false, {message: 'Incorrect password'})
			}
			// create the loginMessage and save it to session as flashdata
			// all is well, return successful user
		})
		.catch(err => {
			cb(err)
		})
		connection.release()
	})
}))
