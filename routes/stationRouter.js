const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const moment = require('moment')
const cors = require('cors')
// const stationData = require('form-data')
const multer = require('multer')
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

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images/uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '.' + file.mimetype.split('/')[1])
	}
})
const upload = multer({
	storage: storage
})
// const upload = multer({dest: 'images/uploads'})

router.options('*', cors())
router.use(cors())

router.route('/')
.all((req, res, next) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	next()
})
.get((req, res) => {
	let sql = `Select * From stations`
	pool.getConnection().then(function(connection) {
		connection.query(sql)
		.then((rows) => {
			res.json(rows)
		})
		.catch((err) => {
			throw err
		})
	})
})
.post(upload.any(), async(req, res) => {
	console.log(req.files)
	console.log((req.body.webFormData))
	let stationData = JSON.parse(req.body.webFormData)
	let imagePath = 'images/uploads/' + req.files.filename
	let date = new Date()
	date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
	let sql = 'INSERT INTO stations (station_name, durationInMins, description, ' +
		'noOfReservedSlots, station_start, station_end, date_added, date_updated, imagepath) VALUES ?'
	let stationVal = [stationData.name, stationData.duration, 'Empty...',
		stationData.noRSlots, '10:00', '18:00', date, date, imagepath]
	pool.getConnection().then(function (connection) {
		connection.query(sql, [stationVal])
		.then((rows) => {
			let stationId = rows.insertId
			if (stationData.roles) {
				let rolesData = stationData.roles
				sql = 'INSERT INTO station_roles (station_id, role_name, capacity, ' +
					'date_added, date_updated) VALUES ?'
				let rolesVal = []
				for (role in rolesData) {
					rolesVal.push([stationId, role.roleName, role.capacity, date, date])
				}
			}
			return connection.query(sql, [rolesVal])
		})
		.then((rows) => {
			res.json({
				message: 'File Uploaded Successfully'
			})
		})
		.catch((err) => {
			throw err
		})
	})
})

router.route('/:stationID')
.all((req, res, next) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	next()
})
.get((req, res) => {
	let sql = `Select * From stations Where station_id = ?`
	pool.getConnection().then(function(connection) {
		connection.query(sql, [req.params.stationID])
		.then((rows) => {
			res.json(rows)
		})
		.catch((err) => {
			throw err
		})
	})
})
.put(upload.any(), (req, res) => {
	let stationData = JSON.parse(req.body.webFormData)
	let imagepath = 'images/uploads' + req.files.filename
	let sql = `Update stations Set station_name=?, description=?, durationInMins=?, noOfReservedSlots=?,
		station_start=?, station_end=?, imagepath=? Where station_id = ?`
	let val = [stationData.stationName, stationData.description, stationData.duration, 
		stationData.noOfRSlots, stationData.start, stationData.end, imagepath, req.params.stationID]
	pool.getConnection().then(function(connection) {
		connection.query(sql, val)
		.then((rows) => {
			res.json(rows)
		})
		.catch((err) => {
			throw err
		})
	})
})

module.exports = router