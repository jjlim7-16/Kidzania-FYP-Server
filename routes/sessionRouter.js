const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const moment = require('moment')
const cors = require('cors')

const router = express.Router()
router.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 100000
}))
router.use(bodyParser.json({limit: '50mb'}))

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
})

router.use(cors())

router.route('/')
  .all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next() //Continue on to the next method -> .get(...)
  })
  .get((req, res) => {
    let sql = `Select * From sessions`
    connection.query(sql, function(err, results) {
      if (err) throw err
      res.json(results)
    })
  })

module.exports = router