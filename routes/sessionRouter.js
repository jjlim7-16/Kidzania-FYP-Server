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

router.route('/')
	.all((req, res, next) => {
		res.statusCode = 200
		res.setHeader('Content-Type', 'text/plain')
		next() //Continue on to the next method -> .get(...)
	})
	.get((req, res) => {
		let sql = `Select * From sessions`
		pool.getConnection().then(function (connection) {
			connection.query(sql).then(results => {
				res.json(results)
			})
		})
	})

router.get('/:stationID/:roleName', (req, res) => {
	let date = new Date()
	date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
	let sql = `SELECT * FROM available_booking_slots WHERE station_id = ?, role_name = ?, session_date = ?`
	let val = [req.params.stationID, req.params.roleName, date]
	pool.getConnection().then(function (connection) {
		connection.query(sql, val).then(results => {
			res.json(results)
		})
	})
})

router.get('/availableSessions', (req, res) => {
	let date = new Date()
	date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
	let bookingSpecifics = JSON.parse(req.body.webFormData)
	let sql = `SELECT * FROM available_booking_slots WHERE station_id = ?, role_name = ?, session_date = ?`
	let val = [bookingSpecifics.stationId, bookingSpecifics.roleName, date]
	pool.getConnection().then(function(connection) {
		connection.query(sql, val).then(results => {
			res.json(results)
		})
	})
})

module.exports = router