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

const storage = multer.diskStorage( {
  destination:(req, file, cb) =>  {
    const dir = '/images/' + file.fieldname.split('-')[0]
    mkdirp(dir, err => cb(err, dir))
  }, 
  filename:(req, file, cb) =>  {
    cb(null, file.fieldname + '.' + file.mimetype.split('/')[1])
  }
})
const upload = multer( {
  storage:storage
})

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file; 
      if (fs.lstatSync(curPath).isDirectory()) {// recurse
deleteFolderRecursive(curPath); 
      }else {// delete file
fs.unlinkSync(curPath); 
      }
    }); 
    fs.rmdirSync(path); 
  }
}
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

  .post((req, res) =>  {

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




module.exports = router
