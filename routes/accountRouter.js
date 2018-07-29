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
    })
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


router.get('/getAccountTypeCrewList/', function(req,res){
  let sql = `select a.*, st.station_name from account_type a
    INNER JOIN stations st ON st.station_id = a.station_id`
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


router.post('/addUser', (req, res) => {
  let sql =`insert into user_accounts( account_type_id,username,password_hash)values (?,?,?)`
  let passwordhash = "";
  let data = req.body;
  let userData = [parseInt(data.account_type_id),data.username,passwordhash];
  pool.getConnection().then(function(connection) {
    connection.query(sql,userData)
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



  .post(upload.any(),(req, res) => {
    // console.log(req.files)
    // console.log((req.body.webFormData))
    const saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(req.params.password, salt);


    let userData = JSON.parse(req.body.webFormData)
    let sql = ` Insert into user_accounts(account_type_id,username,password_hash) values 
    ((select account_type_id from account_type where station_id = ?), ?,?) `

    let stationVal = [[userData.user_id, userData.account_type_id, userData.username,
      userData.account_type,hash,]]
    pool.getConnection().then(function(connection) {
      connection.query(sql, [stationVal])
        .then(results => {
          res.json(results)
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


module.exports = router
