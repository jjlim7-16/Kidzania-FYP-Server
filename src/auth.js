const express = require('express')
const router  = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')

router.post('/login', function (req, res, next) {
	passport.authenticate('local-login', {session: false}, (err, user, info) => {
		console.log(err)
		if (err || !user) {
			return res.status(401).json({
				message: 'ERROR'
			})
		}
		req.login(user, {session: false}, (err) => {
			if (err) {
				res.send(err)
			}
			// generate a signed son web token with the contents of user object and return it in the response
			let userobj = {
				user_id: user.user_id,
				username: user.username,
				password_hash: user.password_hash
			}
			const token = jwt.sign(userobj, 'SECRET')
			return res.json({user, token})
		})
	})(req, res)
})

module.exports = router
