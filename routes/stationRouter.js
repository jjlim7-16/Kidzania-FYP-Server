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
		pool.getConnection().then(function (connection) {
			connection.query(sql)
				.then((rows) => {
					// let time = new Date()
					// time.setHours(10); time.setMinutes(0); time.setSeconds(0); time.setMilliseconds(0)
					res.json(rows)
				})
				.catch((err) => {
					throw err
				})
		})
	})
	.post((req, res) => {
		console.log(req.files)
		console.log((req.body.webFormData))
		let stationData = JSON.parse(req.body.webFormData)
		// let imagePath = 'images/uploads'
		let date = new Date()
		date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
		let sql = 'INSERT INTO stations (station_name, durationInMins, description, ' +
			'noOfReservedSlots, station_start, station_end, date_added, date_updated) VALUES ?'
		let stationVal = [stationData.name, stationData.duration, 'Empty...',
		stationData.noRSlots, '10:00', '18:00', date, date]
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
					res.json(rows)
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
		pool.getConnection().then(function (connection) {
			connection.query(sql, [req.params.stationID])
				.then((rows) => {
					res.json(rows)
				})
				.catch((err) => {
					throw err
				})
		})
	})
	.put((req, res) => {		// Image Upload Not Added Yet
		let stationData = JSON.parse(req.body.webFormData)
		let imagepath = 'images/uploads'
		let sql = `Update stations Set station_name=?, description=?, durationInMins=?, noOfReservedSlots=?,
		station_start=?, station_end=?, imagepath=? Where station_id = ?`
		let val = [stationData.stationName, stationData.description, stationData.duration,
		stationData.noOfRSlots, stationData.start, stationData.end, imagepath, req.params.stationID]
		pool.getConnection().then(function (connection) {
			connection.query(sql, val)
				.then((rows) => {
					res.json(rows)
				})
				.catch((err) => {
					throw err
				})
		})
	})

router.post('/add', upload.any(), async (req, res) => {
	console.log(req.files)
	console.log((req.body.webFormData))
	let stationData = JSON.parse(req.body.webFormData)
	// let imagePath = 'images/uploads'
	let date = new Date()
	date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
	let sql = 'INSERT INTO stations (station_name, durationInMins, description, ' +
		'noOfReservedSlots, station_start, station_end, date_added, date_updated) VALUES ?'
	let stationVal = [stationData.name, stationData.duration, 'Empty...',
			stationData.noRSlots, '10:00', '18:00', date, date]
	pool.getConnection().then(function(connection) {
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
			res.json(rows)
		})
		.catch((err) => {
			throw err
		})
	})
})

router.get('/seedSessions', (req, res) => {
	let sql = 'Select s.station_id, s.station_name, role_name, s.station_start, s.station_end, ' +
		's.durationInMins, capacity From stations s, station_roles sr where s.station_id = sr.station_id'
	pool.getConnection().then(function(connection) {
		connection.query(sql)
		.then((rows) => {
			let stationList = []
			let date = new Date()
			date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
			for (var x in rows) {
				let station = rows[x]
				let start = moment(station.station_start, 'HH:mm:ss')
				let end = moment(station.station_end, 'HH:mm:ss')
				let duration = parseInt(station.durationInMins)
				while(start.format('HH:mm') < end.format('HH:mm')) {
					stationList.push([station.station_id, station.role_name, start.format('HH:mm'),
						start.add(duration, 'minutes').format('HH:mm'), station.capacity, date, date
					])
					start.add(duration, 'minutes')
				}
			}
			res.json(stationList)
			sql = 'INSERT INTO sessions (station_id, role_name, session_start, ' +
				'session_end, capacity, date_added, date_updated) VALUES ?'
			return connection.query(sql, [stationList])
		})
		.then((rows) => {
			res.json(rows)
		})
		.catch((err) => {
			throw err
		})
	})
})

router.get('/getAvailableTimeSlots', (req, res) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	let result = {
		station_name: 'Aviation',
		role_name: 'Crew',
		noBooked: 0,
		capacity: 8,
		timeslot: ['1000-1030', '1030-1100', '1100-1130', '1130-1200']
	}
	// let arr = []
	// arr.push(result)
	res.json(result)
})

router.get('/seed', (req, res) => {
	let sql = 'Select * From sessions'
	pool.getConnection().then(function(connection) {
		connection.query(sql)
		.then((rows) => {
			res.json(rows)
		})
	})
})

router.get('/getStationRoles', (req, res) => {
	console.log('StationRoles')
	let sql = `Select s.station_name, role_name, s.durationInMins, capacity From stations s, station_roles sr
              where s.station_id = sr.station_id`
	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then((rows) => {
				console.log(rows)
				res.json(rows)
			})
			.catch((err) => {
				throw err
			})
	})
})

module.exports = router