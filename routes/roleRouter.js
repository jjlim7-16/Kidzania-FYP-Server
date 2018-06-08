const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const formData = require('form-data')
const http = require('http')
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
	let sql = `Select * From station_roles`
	pool.getConnection().then(function(connection) {
		connection.query(sql).then(results => {
			res.json(results)
		})
	})
})
.post((req, res) => {
	let roleData = JSON.parse(req.body.webFormData)
	let sql = 'INSERT INTO station_roles (station_id, role_name, capacity) VALUES ?'
	let role_val = []
	role_val.push([roleData.stationId, roleData.roleName, roleData.capacity])
	pool.getConnection().then(function(connection) {
		connection.query(sql, [role_val])
		.then((results) => {
			res.json(results)
		})
	})
})

router.route('/:stationID')
.all((req, res, next) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	next() //Continue on to the next method -> .get(...)
})
.get((req, res) => {
	let sql = 'Select * From station_roles Where station_id = ' + req.params.stationID
	pool.getConnection().then(function(connection) {
		connection.query(sql)
		.then((results) => {
			res.json(results)
		})
	})
})

router.route('/:roleID')
.all((req, res, next) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	next() //Continue on to the next method -> .get(...)
})
.get((req, res) => {
	let sql = `SELECT * FROM station_roles where role_id = ?`
	pool.getConnection().then(function(connection) {
		connection.query(sql, req.params.roleID)
		.then(results => {
			res.json(results)
		})
	})
})
.put((req, res) => {
	let roleData = JSON.parse(req.body.webFormData)
	let sql = `UPDATE station_roles SET role_name = ?, capacity = ? WHERE role_id = ?`
	let role_val = [roleData.newRoleName, roleData.capacity, req.params.roleID]
	pool.getConnection().then(function(connection) {
		connection.query(sql, role_val, (results) => {
			res.json(results)
		})
	})
})
.delete((req, res) => {
	let sql = 'DELETE FROM station_roles WHERE role_id = ' + req.params.roleID
	pool.getConnection().then(function(connection) {
		connection.query(sql)
		.then((results) => {
			res.json(results)
		})
	})
})

module.exports = router