const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const cors = require('cors')
const stationData = require('form-data')
const multer = require('multer')
const fs = require('fs')
const http = require('http')

const router = express.Router();
router.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 100000
}))
router.use(bodyParser.json( {limit: '50mb'} ));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '.' + file.mimetype.split('/')[1])
  }
});
const upload = multer({storage: storage})
//const upload = multer({dest: 'images/uploads'})

router.options('*', cors())

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "kidzania_fyp",
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
}); 

router.use(cors())

router.route('/get')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();     //Continue on to the next method -> .get(...)
})
.get((req, res) => {
  let sql = `Select * From stations`
  connection.query(sql, function (err, results) {
    if (err) throw err;
    res.json(results)
  });
})

router.route('/getStationRoles')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();     //Continue on to the next method -> .get(...)
})
.get((req, res) => {
  let sql = `Select s.station_name, role_name, s.durationInMins, capacity From stations s, station_roles sr
            where s.station_id = sr.station_id`
  connection.query(sql, function (err, results) {
    if (err) throw err;
    res.json(results)
  });
})

router.route('/add')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();     //Continue on to the next method -> .get(...)
})
.post((req, res) => {
  console.log(req)
  console.log(res)
})

router.post('/addFile', upload.any(), async (req, res) => {
  console.log(req.files)
  console.log((req.body.webFormData))
  let stationData = JSON.parse(req.body.webFormData)
  let imagePath = 'images/uploads'
  let sql = 'INSERT INTO stations (station_name, durationInMins, ' +
            'description, noOfReservedSlots, station_start, station_end) VALUES ?'
  let station_val = [[stationData.name, stationData.duration, 'Empty...', 
                stationData.noRSlots, 1000, 1800]]
                
  connection.query(sql, [station_val], function (err, result, fields) {
    // Throw error if any error met when executing above query
    if (err) throw err;
    console.log(result.insertId);
    let stationId = result.insertId

    let rolesData = stationData.roles[0]
    sql = 'INSERT INTO station_roles (station_id, role_name, capacity) VALUES ?'
    let roles_val = [[ stationId, rolesData.roleName, rolesData.capacity ]]
    
    connection.query(sql, [roles_val], function (err, result, fields) {
      // Throw error if any error met when executing above query
      if (err) throw err;
      console.log(result)
    })
  })

  res.json({ 'message': 'File Uploaded' })
})

router.get('/seedData', (req, res) => {
  let sql = 'Select s.station_id, s.station_name, role_name, s.station_start, s.station_end, ' +
  's.durationInMins, capacity From stations s, station_roles sr where s.station_id = sr.station_id'
  let station
  connection.query(sql, function (err, results) {
    if (err) throw err
    //res.json(results)
    station = results
    
    let stationList = []
    for (var x in station) {
      let currStation = station[x]
      let start = currStation.station_start
      while (start < currStation.station_end) {
        /*let session = {
          station_id: currStation.station_id,
          station_name: currStation.station_name,
          role_name: currStation.role_name,
          session_start: start,
          session_end: start + currStation.durationInMins,
          capacity: currStation.capacity,
          noBooked: 0
        }*/
        stationList.push([currStation.station_id, currStation.role_name,
                          start, start+currStation.durationInMins, currStation.capacity, 0])
        start += currStation.durationInMins
      }
    }
    //console.log(stationList)
    sql = 'INSERT INTO sessions (station_id, role_name, session_start, ' +
          'session_end, capacity, noBooked) VALUES ?'
    connection.query(sql, [stationList], function (err, results) {
      if (err) throw err
      res.json(results)
    })
  })
  //connection.end()


  //connection.connect()
})

module.exports = router