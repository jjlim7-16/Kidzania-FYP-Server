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

	// find a user whose username matches
	// we are checking to see if the user trying to login already exists
	pool.getConnection().then(function (connection) {
		connection.query(`SELECT ua.*, a.account_type, st.station_name FROM user_accounts ua
			INNER JOIN account_type a ON ua.account_type_id = a.account_type_id
			LEFT JOIN stations st ON st.station_id = a.station_id
			WHERE username = ?`, username)
		.then(rows => {
			console.log(rows)
			if (!rows.length) {
				return cb(null, { user: null, error: 'User not found' }, {message: 'User not found'})
			}
			if (bcrypt.compareSync(password, rows[0].password_hash)) {
				return cb(null, rows[0], {message: 'Logged In Successfully'})
			}
			else {
				return cb(null, { user: null, error: 'Incorrect password' }, {message: 'Incorrect password'})
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
