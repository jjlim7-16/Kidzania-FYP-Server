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
const bcrypt = require('bcrypt')
const saltRounds = 10;

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
  .get((req, res) => {
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
      connection.release()
    })
  })
  .post((req, res) => {
    console.log(req.body)
    let data = req.body;
    let sql =`insert into user_accounts( account_type_id,username,password_hash)values (?)`
    var salt = bcrypt.genSaltSync(saltRounds);
    var passwordhash = bcrypt.hashSync(data.password, salt);
    let userData = [[data.account_type_id,data.username,passwordhash]];
    console.log(userData)
    pool.getConnection().then(function(connection) {
      connection.query(sql, userData)
        .then((rows) => {
          res.json(rows)
          res.status(200).end()
        })
        .catch((err) => {
          res.statusMessage = err
          res.status(400).end()
        })
      connection.release()
    })
  })

router.get('/getAccountTypeCrewList', (req,res) => {
  let sql = `SELECT a.*, st.station_name FROM account_type a
    INNER JOIN stations st ON st.station_id = a.station_id 
    where a.account_type = 'Crew';`
  pool.getConnection().then(function (connection) {
    connection.query(sql)
      .then((rows) => {
        res.json(rows)
      })
      .catch(err => {
        res.statusMessage = err
        res.status(400).end()
      })
    connection.release()
  })
})


router.route('/:userID')
.all((req, res, next) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  next()
})

.get((req, res) => {
  let sql = `SELECT ua.user_id, ua.account_type_id, ua.username, acct.account_type,acct.station_id
  FROM user_accounts ua, account_type acct
  where ua.account_type_id = acct.account_type_id and ua.user_id = ?`

  pool.getConnection().then(function (connection) {
    connection.query(sql, parseInt(req.params.userID) )
      .then((rows) => {
        res.json(rows)
      })
      .catch(err => {
        res.statusMessage = err
        res.status(400).end()
      })
    connection.release()
  })
})

.put((req, res) => {

    let userData = req.body;
    var salt = bcrypt.genSaltSync(saltRounds);
    var passwordhash = bcrypt.hashSync(userData.password, salt);
    let sql = `update user_accounts set account_type_id = ?, username = ?, password_hash = ?
  where user_id = ?`
    let userVal = [userData.account_type_id, userData.username, passwordhash, parseInt(req.params.userID)]
    pool.getConnection().then(function (connection) {
      connection.query(sql, userVal)
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

router.get('/getListOfAccountbyAccountTypeID/:accountTypeID', function (req, res) {
  let sql = `SELECT ua.user_id, ua.account_type_id, ua.username, acct.account_type
    FROM user_accounts ua, account_type acct
    where ua.account_type_id = acct.account_type_id and ua.account_type_id = ?`

  pool.getConnection().then(function (connection) {
    connection.query(sql, parseInt(req.params.accountTypeID))
      .then((rows) => {
        res.json(rows)
      })
      .catch(err => {
        res.statusMessage = err
        res.status(400).end()
      })
    connection.release()
  })
})


module.exports = router
