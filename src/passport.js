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
	if (!jwtPayload) {
		return cb(err)
	}
	return cb(null, jwtPayload)
	// Find User from DB if need...
}
))

passport.use('local-login', new LocalStrategy({
	// by default, local strategy uses username and password, we will override with email
	usernameField : 'username',
	passwordField : 'password'
	// passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(username, password, cb) {

	// find a user whose username matches
	// we are checking to see if the user trying to login already exists
	pool.getConnection().then(function (connection) {
		connection.query(`SELECT ua.*, a.account_type, a	.station_id FROM user_accounts ua
			INNER JOIN account_type a ON ua.account_type_id = a.account_type_id
			WHERE username = ?`, username)
		.then(rows => {
			if (!rows.length) {
				return cb(null, false, {message: 'Incorrect username or password. Please try again.'})
			}
			if (bcrypt.compareSync(password, rows[0].password_hash)) {
				let user = {
					username: rows[0].username,
					account_type: rows[0].account_type,
					station_id: rows[0].station_id
				}
				return cb(null, user, {message: 'Logged In Successfully'})
			}
			else {
				return cb(null, false, {message: 'Incorrect username or password. Please try again.'})
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
