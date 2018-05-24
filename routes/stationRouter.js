const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const moment = require('moment')
const cors = require('cors')
// const stationData = require('form-data')
const multer = require('multer')
// const fs = require('fs')
// const http = require('http')

const router = express.Router()
router.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 100000
}))
router.use(bodyParser.json({limit: '50mb'}))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '.' + file.mimetype.split('/')[1])
  }
})
const upload = multer({storage: storage})
// const upload = multer({dest: 'images/uploads'})

router.options('*', cors())

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'kidzania_fyp',
  multipleStatements: true
})

connection.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
})

router.use(cors())

router.route('/get')
  .all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
  })
  .get((req, res) => {
    let sql = `Select * From stations`
    connection.query(sql, function (err, results) {
      if (err) throw err
      let time = new Date()
      time.setHours(10); time.setMinutes(0); time.setSeconds(0); time.setMilliseconds(0)
      time = moment(time).add(20, 'minutes')
      time = time.get('hours') + ':' + time.get('minutes')
      let date = new Date()
      date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
      m = moment('10:00:00', 'HH:mm:ss')
      m = m.add(20, 'minutes').format('HH:mm')
      console.log(moment(results[0].station_start, 'HH:mm:ss'))
      console.log(date)
      res.json(results)
    })
  })

router.route('/getStationRoles')
  .all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
  })
  .get((req, res) => {
    let sql = `Select s.station_name, role_name, s.durationInMins, capacity From stations s, station_roles sr
              where s.station_id = sr.station_id`
    connection.query(sql, function (err, results) {
      if (err) throw err
      res.json(results)
    })
  })

router.post('/add', upload.any(), async (req, res) => {
  console.log(req.files)
  console.log((req.body.webFormData))
  let stationData = JSON.parse(req.body.webFormData)
  // let imagePath = 'images/uploads'
  let date = new Date()
  date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
  let sql = 'INSERT INTO stations (station_name, durationInMins, description, ' +
            'noOfReservedSlots, station_start, station_end, date_added, date_updated) VALUES ?'
  let stationVal = [[stationData.name, stationData.duration, 'Empty...',
    stationData.noRSlots, '10:00', '18:00', date, date]]

  connection.query(sql, [stationVal], function (err, result, fields) {
    // Throw error if any error met when executing above query
    if (err) throw err
    console.log(result.insertId)
    let stationId = result.insertId

    let rolesData = stationData.roles
    sql = 'INSERT INTO station_roles (station_id, role_name, capacity, ' + 
          'date_added, date_updated) VALUES ?'
    let rolesVal = []
    for (role in rolesData) {
      rolesVal.push([ stationId, role.roleName, role.capacity, date, date])
    }

    connection.query(sql, [rolesVal], function (err, result, fields) {
      // Throw error if any error met when executing above query
      if (err) throw err
      console.log(result)
    })
  })
  res.json({ 'message': 'File Uploaded' })
})

router.get('/seedSessions', (req, res) => {
  let sql = 'Select s.station_id, s.station_name, role_name, s.station_start, s.station_end, ' +
  's.durationInMins, capacity From stations s, station_roles sr where s.station_id = sr.station_id'
  
  connection.query(sql, function (err, results) {
    if (err) throw err
    // res.json(results)
    stations = results
    let stationList = []
    for (var x in stations) {
      let station = stations[x]
      let start = moment(station.station_start)
      while (station.station_start < station.station_end) {
        stationList.push([station.station_id, station.role_name, start.format('HH:mm'), 
          start.add(station.durationInMins, 'minutes').format('HH:mm'), station.capacity])
        start.add(station.durationInMins, 'minutes')
      }
    }
    console.log(stationList)
    sql = 'INSERT INTO sessions (station_id, role_name, session_start, ' +
          'session_end, capacity) VALUES ?'
    connection.query(sql, [stationList], function (err, results) {
      if (err) throw err
      res.json(results)
    })
  })
  // connection.end()
})

router.get('/seedAvailableSessions', (req, res) => {
  let sql = 'Select * From sessions'
  let station
  connection.query(sql, function (err, results) {
    if (err) throw err
    // res.json(results)
    sessions = results
    let date = new Date()
    date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
    let sessionList = []
    for (var x in sessions) {
      let session = sessions[x]
      sessionList.push([session.session_id, date, session.station_id, session.role_name,
        session.session_start, session.session_end, session.capacity, 0])
    }
    console.log(sessionList)
    sql = 'INSERT INTO available_booking_slots (session_id, session_date, station_id, role_name, ' +
    'session_start, session_end, capacity, noBooked) VALUES ?'
    
    connection.query(sql, [sessionList], function (err, results) {
      if (err) throw err
      res.json(results)
    })
  })
  // connection.end()
})

router.get('/getBookings', (req, res) => {
  let sql = 'Select * From booking_details'

  connection.query(sql, function (err, result, fields) {
    // Throw error if any error met when executing above query
    if (err) throw err
    res.json(result)
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

module.exports = router
