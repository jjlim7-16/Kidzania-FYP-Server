function requireRole(roles) {
	return (req, res, next) => {
		console.log(req.get('user'))
		if (!req.get('user')) {
			console.log('1st')
			return res.status(401).send('Unauthorized')
		}

		const user = req.get('user')

		if (!roles.includes(user)) {
			console.log('2nd')
			return res.status(401).send('Unauthorized')
		}

		next()
	}

}

module.exports = {
	requireRole
}