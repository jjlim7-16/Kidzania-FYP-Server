function requireRole(roles) {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).send('Unauthorized')
		}

		const user = req.user

		if (!roles.includes(user.account_type)) {
			return res.status(401).send('Unauthorized')
		}

		next()
	}

}

module.exports = {
	requireRole
}