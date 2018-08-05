function requireRole(roles) {
	return (req, res, next) => {
		console.log(req.user)
		if (!req.user) {
			console.log('1st')
			return res.status(401).send('Unauthorized')
		}

		const user = req.user

		if (!roles.includes(user.account_type)) {
			console.log('2nd')
			return res.status(401).send('Unauthorized')
		}

		next()
	}

}

module.exports = {
	requireRole
}