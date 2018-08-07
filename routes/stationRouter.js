const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const moment = require('moment')
const cors = require('cors')
// const stationData = require('form-data')
const multer = require('multer')
const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')
const db = require('../src/databasePool')
const pool = db.getPool()
// Re-uses existing if already created, else creates a new one

const seedData = require('../src/seedData')
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
		const dir = 'images/'
		cb(null, dir)
	},
	filename: (req, file, cb) => {
		let filename = file.fieldname + '.' + file.mimetype.split('/')[1]
		cb(null, filename)
	}
})
const upload = multer({
	storage: storage
})

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
			.then(rows => {
				res.json(rows)
			})
			.catch(err => {
				throw err
			})
			connection.release()
	})
})
.post(upload.any(), (req, res) => {
	let stationData = JSON.parse(req.body.webFormData)
	let imagepath = req.files[0].filename
	let sql = `INSERT INTO stations (station_name, description, station_start, station_end,
		durationInMins, imagepath, is_active) VALUES ?`
	let stationVal = [[stationData.name, stationData.description,
		stationData.startTime, stationData.endTime, stationData.duration, imagepath, 0
	]]
	let stationID
	pool.getConnection().then(function(connection) {
		connection.query(sql, [stationVal])
			.then((rows) => {
				stationID = rows.insertId
				let rolesVal = []
				let rolesData = stationData.roles
				sql = `INSERT INTO station_roles (station_id, role_name, capacity, imagepath) VALUES ?`
				for (var i=0; i<rolesData.length; i++) {
					rolesVal.push([stationID, rolesData[i].roleName, rolesData[i].capacity, 
						req.files[i+1].filename])
				}
				return connection.query(sql, [rolesVal])
			})
			.then(rows => {
				console.log('Station-Roles Successfully Added')
				return seedData.seedNewSessions(stationID)
			})
			.then(results => {
				res.json(stationID)
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end(err.code)
			})
			connection.release()
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
			.then(results => {
				res.json(results)
			})
			.catch((err) => {
				res.statusMessage = err
				res.status(400).end()
			})
			connection.release()
	})
})
.put(upload.any(), (req, res) => {
	// Have yet to update the web app form for activation/deactivation
	let stationData = JSON.parse(req.body.webFormData)
	let sql = `SELECT station_name, station_start, station_end, imagepath 
	FROM stations WHERE station_id = ${req.params.stationID};`
	let changeName = false
	let origFile = ''
	let newFilename = ''
	let durationChanged = false
	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then(results => {
				origFile = results[0].imagepath
				changeName = (results[0].station_name !== stationData.name) ? true : false
				let val = []
				if (req.files.length > 0 || changeName === true) {
					newFilename = (req.files.length === 0) ? `${stationData.name}.${origFile.split('.')[1]}`
						: req.files[0].filename
					sql = `Update stations Set station_name=?, description=?,
					station_start=?, station_end=?, durationInMins=?, imagepath=?  Where station_id = ?;`
					val = [ stationData.name, stationData.description, stationData.startTime,
						stationData.endTime, stationData.duration, newFilename, req.params.stationID
					]
				}
				else if (req.files.length <= 0) {
					sql = `Update stations Set station_name=?, description=?,
					station_start=?, station_end=?, durationInMins=? Where station_id = ?;`
					val = [ stationData.name, stationData.description, stationData.startTime,
						stationData.endTime, stationData.duration, req.params.stationID
					]
				}
				if (moment(results[0].station_start, 'HH:mm').format('HH:mm') !== 
				moment(stationData.startTime, 'HH:mm').format('HH:mm') || 
				moment(results[0].station_end, 'HH:mm').format('HH:mm') !== 
				moment(stationData.endTime, 'HH:mm').format('HH:mm') || 
				(stationData.duration != results[0].durationInMins)) {
					sql += `DELETE FROM sessions WHERE station_id = ${req.params.stationID};`
					durationChanged = true
				}

				return connection.query(sql, val)
			})
			.then(() => {
				if (req.files.length > 0 && changeName === true) {
					// Change station/file name -> Delete orig file
					fs.unlinkSync('images/' + origFile)
				}
				else if (req.files.length > 0 && changeName === false) {
					// Delete orig file if changed image, with same station name, are of diff type 
					if (newFilename.split('.')[1] !== origFile.split('.')[1]) {
						fs.unlinkSync('images/' + origFile)
					}
				}
				else if (req.files.length <= 0 && changeName === true) {
					// Rename original file if change station name
					console.log('Renaming File...')
					fs.renameSync('images/' + origFile, `images/${newFilename}`)
				}
				if (durationChanged) {
					seedData.seedNewSessions(req.params.stationID)
				}
				res.end('Success')
			})
			.catch((err) => {
				res.statusMessage = err
				res.status(400).end()
			})
			connection.release()
	})
})
.delete((req, res) => {
	let sql = `SELECT imagepath FROM stations WHERE station_id = ${req.params.stationID}
		UNION SELECT imagepath FROM station_roles WHERE station_id = ${req.params.stationID};`

	sql += 'Delete From stations where station_id = ' + req.params.stationID
	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then(results => {
				for (i in results[0]) {
					fs.unlinkSync('images/' + results[0][i].imagepath)
				}
				res.json(results)
			})
			.catch(err => {
				console.log(err)
			})
			connection.release()
	})
})

router.put('/activate/:stationID', (req, res) => {
	let newActiveStatus = req.body.newActiveStatus
	console.log(newActiveStatus)
	let sql = `Update stations Set is_active=? Where station_id = ?`
	let val = [newActiveStatus, req.params.stationID]
	pool.getConnection().then(function(connection) {
		connection.query(sql, val)
			.then((rows) => {
				// console.log(rows)
				console.log(rows)
				res.end('Success')
			})
			.catch((err) => {
				res.statusMessage = err
				res.status(400).end()
			})
			connection.release()
	})
})

module.exports = router
