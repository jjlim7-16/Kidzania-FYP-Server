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


const seedData = require('../src/seedData')
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = '/images/' + file.fieldname.split('-')[0]
    mkdirp(dir, err => cb(err, dir))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '.' + file.mimetype.split('/')[1])
  }
})
const upload = multer({
  storage: storage
})

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

router.get('/:userID', function (req, res) {
  var userID = parseInt(req.params.userID)
  let sql = `SELECT ua.user_id, ua.account_type_id, ua.username, acct.account_type,acct.station
  FROM user_accounts ua, account_type acct
  where ua.account_type_id = acct.account_type_id and ua.user_id = ?`
  //database query havent filter by date
  pool.getConnection().then(function (connection) {
    connection.query(sql, userID )
      .then((rows) => {
        res.json(rows)
      })
      .catch(err => {
        res.statusMessage = err
        res.status(400).end()
      })
  })
})

router.get('/getListOfAccountbyAccountTypeID/:accountTypeID', function (req, res) {
  var accountTypeID = parseInt(req.params.accountTypeID)
  let sql = `SELECT ua.user_id, ua.account_type_id, ua.username, acct.account_type,ua.station
 FROM user_accounts ua, account_type acct
 where ua.account_type_id = acct.account_type_id and ua.account_type_id = ?`
  //database query havent filter by date
  pool.getConnection().then(function (connection) {
    connection.query(sql, accountTypeID)
      .then((rows) => {
        res.json(rows)
      })
      .catch(err => {
        res.statusMessage = err
        res.status(400).end()
      })
  })
})
router.route('/')
  .all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
  })
  .get((req, res) => {
    let sql = `SELECT ua.user_id, ua.account_type_id, ua.username, acct.account_type,ua.station
 FROM user_accounts ua, account_type acct
 where ua.account_type_id = acct.account_type_id`
    pool.getConnection().then(function (connection) {
      connection.query(sql)
        .then((rows) => {
          res.json(rows)
        })
        .catch(err => {
          res.statusMessage = err
          res.status(400).end()
        })
    })
  })

  .post((req, res) => {
    // console.log(req.files)
    // console.log((req.body.webFormData))
    let userData = JSON.parse(req.body.webFormData)
    date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    let sql = `Insert into user_accounts( user_id, account_type_id, username, account_type,)
     VALUES?`

    let stationVal = [[userData.user_id, userData.account_type_id, userData.username,
      userData.account_type,
    ]]
    let stationID
    pool.getConnection().then(function(connection) {
      connection.query(sql, [stationVal])
        .then((rows) => {
          stationID = rows.insertId
          let stationVal = []
          if (userData.station.length > 0) {
            let crewStationData = userData.station
            sql = 'INSERT INTO account_type (station_id) VALUES ?'
            for (var i=0; i<crewStationData.length; i++) {
              stationVal.push([stationID])
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


  .delete((req, res) => {
    let sql = 'Select username From user_accounts where user_id = ' + req.params.userID + ';'
    sql += 'Delete From user_accounts where user_id = ' + req.params.userID
    pool.getConnection().then(function(connection) {
      connection.query(sql)
        .then(results => {
          deleteFolderRecursive(results[0][0].username + '/')
          res.json(results)
        })
        .catch(err => {
          console.log(err)
        })
      connection.release()
    })
  })

module.exports = router