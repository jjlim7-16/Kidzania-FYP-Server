const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const db = require('../src/databasePool')
const pool = db.getPool()

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
		console.log(user.user_id)
    done(null, user.user_id)
	})
	
	passport.deserializeUser(function (id, done) {
		console.log(id)
		pool.getConnection().then(function (connection) {
			connection.query(`SELECT * FROM user_accounts where user_id = ${id}`, function (err, rows) {
				console.log(rows[0])
				done(err, rows[0])
			})
		})
	})

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, username, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		pool.getConnection().then(function (connection) {
			connection.query(`SELECT * FROM user_accounts where username = ?`, username)
				.then(rows => {
					console.log(rows)
					if (rows.length) {
						return done(null, false, req.flash('signupMessage', 'Username Already Exists'));
					} 
					else {
						// if there is no user with that email, create the user
						var newUserMysql = new Object()
						var hash = bcrypt.hashSync(password, 10)
						newUserMysql.username = username
						newUserMysql.password = hash // use the generateHash function in our user model
						
						var insertQuery = `INSERT INTO user_accounts (username, password_hash) VALUES ?`
						return connection.query(insertQuery, [[[username, hash]]])
					}
				})
				.then(rows => {
					newUserMysql.user_id = rows.insertId
					return done(null, newUserMysql)
				})
				.catch(err => {
					done(err)
				})
				connection.release()
			})
	}))
	
	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, username, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		pool.getConnection().then(function (connection) {
			connection.query(`SELECT * FROM user_accounts where username = ?`, username)
			.then(rows => {
				console.log(rows)
				if (!rows.length) {
					return done(null, false, req.flash('loginMessage', 'User not found'));
				}
				if (bcrypt.compareSync(password, rows[0].password_hash)) {
					return done(null, rows[0], {
						message: 'Logged In Successfully'
					})
				}
				else {
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))
				}
				// create the loginMessage and save it to session as flashdata
				// all is well, return successful user
			})
			.catch(err => {
				done(err)
			})
			connection.release()
		})
	}))
}
