const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const stationData = require('form-data')
const http = require('http')

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

let connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'kidzania_fyp',
	multipleStatements: true
})

connection.connect(function(err) {
	if (err) throw err
	console.log('Connected!')
})

router.use(cors())

router.route('/')
	.all((req, res, next) => {
		res.statusCode = 200
		res.setHeader('Content-Type', 'text/plain')
		next() //Continue on to the next method -> .get(...)
	})
	.get((req, res) => {
		let sql = `Select * From station_roles`
		connection.query(sql, function(err, results) {
			if (err) throw err
			res.json(results)
		})
	})
	.post((req, res) => {
		console.dir(req.body)
		let roleData = req.body
		let sql = 'INSERT INTO station_roles (station_id, role_name, capacity) VALUES ?'
		let role_val = [
			[roleData.stationId, roleData.roleName, roleData.capacity]
		]
		connection.query(sql, [role_val], function(err, results, fields) {
			if (err) throw err
			res.json(results)
		})
	})

router.get('/:stationID', (req, res) => {
		let sql = 'SELECT * FROM station_roles where station_id = ' + req.params.stationID
		connection.query(sql, function(err, results) {
			if (err) throw err
			res.json(results)
		})
	})
	.put('/:stationID', (req, res) => {
		let roleData = req.body
		let sql = 'UPDATE station_roles SET role_name = ?, capacity = ? WHERE station_id = ?'
		let role_val = [roleData.roleName, roleData.capacity, req.params.stationID]
		console.dir(role_val)
		connection.query(sql, role_val, function(err, results, fields) {
			if (err) throw err
			res.json(results)
		})
	})
	.delete('/:stationID', (req, res) => {
		let sql = 'DELETE FROM station_roles WHERE station_id = ' + req.params.stationID
		connection.query(sql, function(err, results) {
			if (err) throw err
			res.json(results)
		})
	})

module.exports = router