const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const moment = require('moment')
const cors = require('cors')
const db = require('../src/databasePool')
const pool = db.getPool()

const router = express.Router()

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
    let sql =`insert into user_accounts( account_type_id,username,password_hash)values (?,?,?)`
    let passwordhash = "";
    let data = req.body;
    let userData = [parseInt(data.account_type_id),data.username,passwordhash];
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
  where ua.account_type_id = acct.account_type_id and ua.user_id = ?;`
  //database query havent filter by date
  pool.getConnection().then(function (connection) {
    connection.query(sql, userID)
      .then((rows) =>  {
        res.json(rows)
      })
      .catch(err =>  {
        res.statusMessage = err
        res.status(400).end()
      })
  })
}).put('/:userID', (req, res) =>  {
  var userID = parseInt(req.params.userID)
  let userData = req.body; 
  let password_hash = "updated password hash"; 
  let sql = `update user_accounts set account_type_id = ?, username = ?, password_hash = ?
  where user_id = ?`
  let userVal = [parseInt(userData.account_type_id), userData.username, password_hash, userID]
  pool.getConnection().then(function (connection) {
    connection.query(sql, userVal)
      .then((rows) =>  {
        // console.log(rows)
        res.end('Success')
      })
      .catch((err) =>  {
        res.statusMessage = err
        res.status(400).end()
      })
    connection.release()
  })
})


router.get('/getListOfAccountbyAccountTypeID/:accountTypeID', function (req, res) {
  var accountTypeID = parseInt(req.params.accountTypeID)
  let sql = `SELECT ua.user_id, ua.account_type_id, ua.username, acct.account_type, ua.station
 FROM user_accounts ua, account_type acct
 where ua.account_type_id = acct.account_type_id and ua.account_type_id = ?`
  //database query havent filter by date
  pool.getConnection().then(function (connection) {
    connection.query(sql, accountTypeID)
      .then((rows) =>  {
        res.json(rows)
      })
      .catch(err =>  {
        res.statusMessage = err
        res.status(400).end()
      })
  })
})


module.exports = router
