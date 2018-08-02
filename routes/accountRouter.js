const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const cors = require('cors')
const db = require('../src/databasePool')
const pool = db.getPool()
 
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

router.options('*', cors())
router.use(cors())
 
router.route('/')
  .all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
  })

router.get('/:userID', function (req, res) {
  var userID = parseInt(req.params.userID)
  let sql = `SELECT ua.user_id, ua.account_type_id, ua.username, acct.account_type,acct.station_id
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
 
 
router.get('/', (req, res) => {
    let sql = ` SELECT ua.user_id, ua.account_type_id, ua.username, acct.account_type,acct.station_id, s.station_name
FROM user_accounts ua
LEFT JOIN account_type acct ON ua.account_type_id  = acct.account_type_id
LEFT JOIN stations s ON s.station_id = acct.station_id `
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

router.post('/', (req, res) => {
  // console.log(req.files)
  // console.log((req.body.webFormData))
  let userData = JSON.parse(req.body.webFormData)
  let sql = ` Insert into user_accounts(account_type_id,username,password_hash) values
  ((select account_type_id from account_type where station_id = ?), ?,?) `

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

router.delete('/:userID', (req, res) => {
  let sql = 'Select username From user_accounts where user_id = ' + req.params.userID + ';'
  sql += 'Delete From user_accounts where user_id = ' + req.params.userID
  pool.getConnection().then(function(connection) {
    connection.query(sql)
      .then((results) => {
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
