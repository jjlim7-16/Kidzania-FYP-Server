const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const cors = require('cors')
const db = require('../src/databasePool')
const pool = db.getPool()
// Re-uses existing if already created, else creates a new one

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
		next() //Continue on to the next method -> .get(...)
	})
	.get((req, res) => {
		let sql = `Select * From sessions`
		pool.getConnection().then(function(connection) {
			connection.query(sql).then(results => {
				res.json(results)
			})
		})
	})

router.get('/:stationID/:roleName', (req, res) => {
	let sql = "SELECT stations.durationInMins, stations.station_start, stations.station_end FROM stations WHERE stations.station_id = " + parseInt(req.params.stationID)
	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then((rows) => {
				durationInMins = parseInt(rows[0].durationInMins)
				sStartTime = moment(rows[0].station_start, 'HH:mm:ss')
				myTime = sStartTime
				sEndTime = moment(rows[0].station_end, 'HH:mm:ss')
				let currTime = moment()
				let noOfTimePeriods = Math.round(parseInt(moment.duration(sEndTime.diff(sStartTime)).asMinutes()) / durationInMins / 6)
				let timePeriodList = []
				let currTimePeriod = {
					earliestStartTime: sStartTime,
					latestEndTime: myTime
				}
				for (let i = 0; i < noOfTimePeriods; i++) {
					let prevTimePeriod
					if (timePeriodList.length >= 1) { //Check if there is at least one time period
						prevTimePeriod = timePeriodList[i - 1] //Holds the time for the earliest timeslot in this period
						console.log(timePeriodList[i - 1])
						currTimePeriod.earliestStartTime = prevTimePeriod.latestEndTime
						currTimePeriod.latestEndTime = currTimePeriod.earliestStartTime
						let tmpLatestEndTime = moment(currTimePeriod.latestEndTime, 'HH:mm:ss')
						tmpLatestEndTime.add(durationInMins * 6, 'minutes')
						currTimePeriod.latestEndTime = tmpLatestEndTime
					} else {
						let tmpLatestEndTime = moment(currTimePeriod.latestEndTime, 'HH:mm:ss')
						tmpLatestEndTime.add(durationInMins * 6, 'minutes')
						currTimePeriod.latestEndTime = tmpLatestEndTime
					}
					timePeriodList.push(currTimePeriod)
				}


				for (let timePeriod in timePeriodList) {
					if (currTime.isBefore(timePeriod.latestEndTime) && currTime.isAfter(timePeriod.earliestStartTime)) {
						currTimePeriod = timePeriod
					}
				}
				let date = new Date()
				date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
				sql = `SELECT s.session_id, a.session_date, s.session_start, s.session_end, a.capacity, a.noBooked
					FROM sessions s, available_booking_slots a WHERE s.session_id = a.session_id && s.station_id = ? && s.role_name = ?
          && s.session_start >= ? && s.session_end <= ? && a.session_date = ?`
				val = [parseInt(req.params.stationID), decodeURI(req.params.roleName), moment(currTimePeriod.earliestStartTime).format('HH:mm:ss'),
					moment(currTimePeriod.latestEndTime).format('HH:mm:ss'), date
				]
				return connection.query(sql, val)
			})
			.then((rows) => {
				console.log('The rows retrieved are' + rows)
				res.json(rows)
			})
			.catch((err) => {
				console.log(err)
			})
	})
})

module.exports = router