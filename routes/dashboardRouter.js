const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const cors = require('cors')
const db = require('../src/databasePool')
const pool = db.getPool()
// Re-uses existing if already created, else creates a new one

const router = express.Router()
router.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true,
	parameterLimit: 100000
}))
router.use(bodyParser.json({
	limit: '50mb'
}))

router.options('*', cors())
router.use(cors())

router.route('/count')
.all((req, res, next) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	next() //Continue on to the next method -> .get(...)
})
.get((req, res) => {
	let sql = 'SELECT COUNT(station_id) as count FROM booking_details WHERE session_date=current_date();'
	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then(rows => {
				res.json(rows)
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end(err.code)
			})
		connection.release()
	})
})

module.exports = router
