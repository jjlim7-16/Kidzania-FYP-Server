const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const formData = require('form-data')
const multer = require('multer')
const fs = require('fs')
const mkdirp = require('mkdirp')
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

let uploadpath = ''
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = '/images/' + file.fieldname.split('-')[0]
		uploadpath = dir
		mkdirp(dir, err => cb(err, dir))
	},
	filename: (req, file, cb) => {
		uploadpath += '/' + file.fieldname + '.' + file.mimetype.split('/')[1]
		cb(null, file.fieldname + '.' + file.mimetype.split('/')[1])
	},
	onFileUploadStart: (req, file, cb) => {
		fs.exists(uploadpath, function(exists) {
			if (exists) {
				return false
			}
		})
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
	next() //Continue on to the next method -> .get(...)
})
.get((req, res) => {
	let sql = `Select st.station_id, st.station_name, role_id, role_name, durationInMins, capacity From station_roles sr, stations st 
	Where st.station_id = sr.station_id; `
	sql += `Select DISTINCT station_id, station_name from stations ORDER BY 1 ASC;`
	pool.getConnection().then(function(connection) {
		connection.query(sql)
		.then(results => {
			res.json(results)
		})
		connection.release()
	})
})
.post(upload.any(), (req, res) => {
	console.log(req.files)
	let roleData = JSON.parse(req.body.webFormData)
	let imagepath = req.files[0].destination + '/' + req.files[0].filename
	let sql = 'INSERT INTO station_roles (station_id, role_name, noOfReservedSlots, durationInMins, ' + 
	'capacity, imagepath) VALUES ?'
	let role_val = []
	role_val.push([roleData.stationId, roleData.roleName, roleData.noOfRSlots, roleData.duration, roleData.capacity, imagepath])
	pool.getConnection().then(function(connection) {
		connection.query(sql, [role_val])
		.then((results) => {
			res.end('Role Added Successfully')
		})
		.catch(err => {
			res.statusMessage = err
			res.status(400).end(err.code)
		})
		connection.release()
	})
})

router.route('/:roleID')
.all((req, res, next) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	next() //Continue on to the next method -> .get(...)
})
.get((req, res) => {
	let sql = 'SELECT * FROM station_roles where role_id = ?; '
	sql += 'Select DISTINCT station_id, station_name from stations;'
	pool.getConnection().then(function(connection) {
		connection.query(sql, req.params.roleID)
		.then(results => {
			res.json(results)
		})
		connection.release()
	})
})
.put(upload.any(), (req, res) => {
	let imagepath = req.files[0].destination + '/' + req.files[0].filename
	let roleData = JSON.parse(req.body.webFormData)
	let sql = `Select imagepath from station_roles where role_id = ` + req.params.roleID
	pool.getConnection().then(function(connection) {
		connection.query(sql)
		.then((results) => {
			if (imagepath !== results[0].imagepath) {
				fs.unlink(results[0].imagepath, (err) => {
					if (err) throw err
					console.log('Successfully deleted role image')
				})
			}
			sql = `UPDATE station_roles SET role_name=?, capacity=?, durationInMins=?, imagepath=? WHERE role_id=?`
			let role_val = [roleData.roleName, roleData.capacity, roleData.duration, imagepath, req.params.roleID]
			return connection.query(sql, role_val)
		})
		.then(results => {
			res.end('Updated Successfully')
		})
		.catch(err => {
			res.statusMessage = err
			res.status(400).end()
		})
		connection.release()
	})
})
.delete((req, res) => {
	let sql = 'SELECT imagepath FROM station_roles WHERE role_id = ' + req.params.roleID + ';'
	sql += 'DELETE FROM station_roles WHERE role_id = ' + req.params.roleID + ';'
	pool.getConnection().then(function(connection) {
		connection.query(sql)
		.then((results) => {
			fs.unlink(results[0].imagepath, (err) => {
				if (err) throw err
				console.log('Successfully deleted role image')
			})
			res.end('Deleted Role Successfully')
		})
		.catch(err => {
			res.statusMessage = err
			res.status(400).end()
		})
		connection.release()
	})
})

module.exports = router