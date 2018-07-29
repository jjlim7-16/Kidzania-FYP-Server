const express = require('express')
const router  = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')

router.post('/login', function (req, res, next) {
	passport.authenticate('local-login', {session: false}, (err, user, info) => {
		if (err) {
			return res.status(500).json({message: 'Internal Server Error'})
		}
		if (!user) {
			return res.status(401).json(info)
		}
		req.login(user, {session: false}, (err) => {
			if (err) {
				res.send(err)
			}
			// generate a signed son web token with the contents of user object and return it in the response
			const token = jwt.sign(user, 'SECRET')
			return res.json({user, token})
		})
	})(req, res)
})

module.exports = router
