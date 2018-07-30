const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const moment = require('moment')
const cors = require('cors')
const db = require('../src/databasePool')
const pool = db.getPool()

const router = express.Router()

router.get('/:userID', function (req, res) {
  var userID = parseInt(req.params.userID)
  let sql = `SELECT ua.user_id, ua.account_type_id, ua.username, acct.account_type, acct.station_id
  FROM user_accounts ua, account_type acct
  where ua.account_type_id = acct.account_type_id and ua.user_id = ?`
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
  }).delete('/:userID', (req, res) =>  {
  var userID = parseInt(req.params.userID); 
  let sql = `Delete From user_accounts where user_id = ?`; 
  pool.getConnection().then(function (connection) {
    connection.query(sql, userID)
      .then(results =>  {
        res.json(results)
      })
      .catch(err =>  {
        console.log(err)
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

router.route('/')
  .all((req, res, next) =>  {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
  })
  .get((req, res) =>  {
    let sql = `SELECT ua.user_id, ua.account_type_id, ua.username, acct.account_type, ua.station
 FROM user_accounts ua, account_type acct
 where ua.account_type_id = acct.account_type_id`
    pool.getConnection().then(function (connection) {
      connection.query(sql)
        .then((rows) =>  {
          res.json(rows)
        })
        .catch(err =>  {
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
     VALUES ?`

    let userData = req.body; 

    let sql = `Insert into user_accounts(account_type_id, username, password_hash)VALUES (?)`
    let passwordHash = "asaasas"; 
    let userVal = [parseInt(userData.account_type_id), userData.username, passwordHash]
    pool.getConnection().then(function (connection) {
      connection.query(sql, [userVal])
        .then((results) =>  {
          res.json(results)
        })
        .catch((err) =>  {
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
          res.json(results)
        })
        .catch(err => {
          console.log(err)
        })
      connection.release()
    })
  })

module.exports = router
