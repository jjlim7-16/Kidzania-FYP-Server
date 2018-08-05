const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const db = require('../src/databasePool')
const pool = db.getPool()

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

router.route('/getStationImage/:stationID')
.get((req, res) => {
	let sql = `Select imagepath From stations Where station_id = ?`
	pool.getConnection().then(function(connection) {
		connection.query(sql, [req.params.stationID])
		.then(results => {
			let data = fs.readFileSync('images/' + results[0].imagepath)
			res.contentType('image/*')
			res.status(200).end(data)
		})
		.catch((err) => {
			res.statusMessage = err
			res.status(400).end()
		})
		connection.release()
	})
})

router.route('/getRoleImage/:roleID')
.get((req, res) => {
	let sql = `Select imagepath From station_roles Where role_id = ?`
	pool.getConnection().then(function(connection) {
		connection.query(sql, [req.params.roleID])
		.then(results => {
			let data = fs.readFileSync('images/' + results[0].imagepath)
			res.contentType('image/*')
			res.status(200).end(data)
		})
		.catch((err) => {
			res.statusMessage = err
			res.status(400).end()
		})
		connection.release()
	})
})

module.exports = router
