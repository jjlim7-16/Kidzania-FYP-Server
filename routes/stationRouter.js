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
		let imagepath = req.files[0].filename
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
							rolesVal.push([stationID, rolesData[i].roleName, rolesData[i].capacity, rolesData[i].duration,
								rolesData[i].noOfRSlots, req.files[i+1].filename])
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

router.route('/image')
.get((req, res) => {
	let imagepath = '../images/Aviation Academy.png'
	let filepath = path.join(__dirname, imagepath)
	console.log(filepath)
	let stat = fs.statSync(filepath)
	res.writeHead(200, {
		'Content-Type': 'image/png',
		'Content-Length': stat.size
	})
	let readstream = fs.createReadStream(filepath)
	readstream.pipe(res)
	// let data = fs.readFileSync(imagepath)
	// res.end(data)
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
		let sql = `SELECT station_name, imagepath FROM stations WHERE station_id = ${req.params.stationID};`
		let changeName = false
		let origFile = ''
		let newFilename = ''
		pool.getConnection().then(function(connection) {
			connection.query(sql)
				.then(results => {
					// console.log(rows)
					origFile = results[0].imagepath
					changeName = (results[0].station_name !== stationData.name) ? true : false
					let val = []
					if (req.files.length > 0 || changeName === true) {
						newFilename = (req.files.length === 0) ? `${stationData.name}.${origFile.split('.')[1]}`
							: req.files[0].filename
						sql = `Update stations Set station_name=?, description=?,
						station_start=?, station_end=?, imagepath=?  Where station_id = ?`
						val = [ stationData.name, stationData.description, stationData.startTime,
							stationData.endTime, newFilename, req.params.stationID
						]
					}
					else {
						sql = `Update stations Set station_name=?, description=?,
						station_start=?, station_end=?  Where station_id = ?`
						val = [ stationData.name, stationData.description, stationData.startTime,
							stationData.endTime, req.params.stationID
						]
					}
					return connection.query(sql, val)
				})
				.then(() => {
					if (req.files.length > 0) {
						fs.unlinkSync('images/' + origFile)
					}
					else if (req.files.length <= 0 && changeName === true) {
						console.log('Renaming File...')
						console.log(origFile)
						fs.renameSync('images/' + origFile, `images/${newFilename}`)
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