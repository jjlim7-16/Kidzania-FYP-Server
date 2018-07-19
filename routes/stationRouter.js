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
		const dir = '/images'
		cb(null, dir)
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '.' + file.mimetype.split('/')[1])
	}
})
const upload = multer({
	storage: storage
})
// const upload = multer({dest: 'images/uploads'})

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

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
		// console.log(req.files)
		// console.log((req.body.webFormData))
		let stationData = JSON.parse(req.body.webFormData)
		let imagepath = req.files[0].destination + '/' + req.files[0].filename
		let date = new Date()
		date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
		let sql = `INSERT INTO stations (station_name, description, station_start, station_end,
			imagepath, is_active) VALUES ?`
		let stationVal = [[stationData.name, stationData.description, 
			stationData.startTime, stationData.endTime, imagepath, 1
		]]
		let stationID
		pool.getConnection().then(function(connection) {
			connection.query(sql, [stationVal])
				.then((rows) => {
					stationID = rows.insertId
					let rolesVal = []
					if (stationData.roles.length > 0) {
						let rolesData = stationData.roles
						sql = 'INSERT INTO station_roles (station_id, role_name, capacity, ' +
							'durationInMins, noOfReservedSlots, imagepath) VALUES ?'
						for (var i=0; i<rolesData.length; i++) {
							imagepath = req.files[i+1].destination + '/' + req.files[i+1].filename
							rolesVal.push([stationID, rolesData[i].roleName, rolesData[i].capacity, 
								rolesData[i].duration, rolesData[i].noOfRSlots, imagepath])
						}
					}
					return connection.query(sql, [rolesVal])
				})
				.then((rows) => {
					console.log('Station-Roles Successfully Added')
					return seedData.seedNewSessions(stationID)
				})
				.then((results) => {
					res.json(results)
				})
				.catch((err) => {
					console.log(err)
					res.statusMessage = err
					res.status(400).end(err.code)
				})
				connection.release()
		})
	})

// router.route('/image')
// .get((req, res) => {
// 	let imagepath = '../images/Clinic/Clinic.jpeg'
// 	let filepath = path.join(__dirname, imagepath)
// 	console.log(filepath)
// 	let stat = fs.statSync(filepath)
// 	res.writeHead(200, {
// 		'Content-Type': 'image/jpeg',
// 		'Content-Length': stat.size
// 	})
// 	let readstream = fs.createReadStream(filepath)
// 	readstream.pipe(res)
// })

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
					console.log(rows)
					res.json(rows)
				})
				.catch((err) => {
					res.statusMessage = err
					res.status(400).end()
				})
				connection.release()
		})
	})
	.put(upload.any(), (req, res) => {
		let stationData = JSON.parse(req.body.webFormData)
		console.log(stationData)
		console.log(req.files)
		let imagepath = req.files[0].destination + '/' + req.files[0].filename
		let sql = `Update stations Set station_name=?, description=?, 
		station_start=?, station_end=?, imagepath=? Where station_id = ?`
		let val = [ stationData.name, stationData.description, stationData.startTime, 
			stationData.endTime, imagepath, req.params.stationID
		]
		pool.getConnection().then(function(connection) {
			connection.query(sql, val)
				.then((rows) => {
					// console.log(rows)
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
		let sql = 'Select station_name From stations where station_id = ' + req.params.stationID + ';'
		sql += 'Delete From stations where station_id = ' + req.params.stationID
		pool.getConnection().then(function(connection) {
			connection.query(sql)
				.then(results => {
					deleteFolderRecursive('./images/' + results[0][0].station_name + '/')
					res.json(results)
				})
				.catch(err => {
					console.log(err)
				})
				connection.release()
		})
	})

module.exports = router