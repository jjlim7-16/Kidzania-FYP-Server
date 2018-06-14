const mysql = require('mysql')
const moment = require('moment')
const db = require('./databasePool')
const pool = db.getPool()

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
	seedNewSessions: function (stationID) {
		let sql = `Select s.station_id, role_id, s.station_start, s.station_end, 
			sr.durationInMins, capacity From stations s, station_roles sr where s.station_id = sr.station_id 
			AND s.station_id = ?;`
		console.log('stationID: ' + stationID)
		pool.getConnection().then(function (connection) {
			connection.query(sql, stationID)
				.then((results) => {
					let sessionList = []
					let date = new Date()
					date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
					for (var x in results) {
						let role = results[x]
						let start = moment(role.station_start, 'HH:mm:ss')
						let end = moment(role.station_end, 'HH:mm:ss')
						let duration = parseInt(role.durationInMins)
						while (start.format('HH:mm') < end.format('HH:mm')) {
							sessionList.push([role.station_id, role.role_id, start.format('HH:mm'),
							start.add(duration, 'minutes').format('HH:mm'), role.capacity, date, date
							])
						}
					}
					sql = 'INSERT INTO sessions (station_id, role_id, session_start, ' +
						'session_end, capacity, date_added, date_updated) VALUES ?'
					return connection.query(sql, [sessionList])
				})
				.then((results) => {
					connection.release()
				})
				.catch((err) => {
					console.log(err.code)
				})
		})
		return Promise.resolve('Success')
	},
	seedSessions: function () {
		let sql = 'Select s.station_id, role_id, s.station_start, s.station_end, ' +
			'sr.durationInMins, capacity From stations s, station_roles sr where s.station_id = sr.station_id; '
		sql += 'Select min(session_id) as session from sessions;'
		pool.getConnection().then(function (connection) {
			connection.query(sql)
				.then((results) => {
					if (results[1][0].session) {
						return Promise.reject('Data Was Seeded')
					}
					let sessionList = []
					let date = new Date()
					date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
					for (var x in results[0]) {
						let station = results[0][x]
						let start = moment(station.station_start, 'HH:mm:ss')
						let end = moment(station.station_end, 'HH:mm:ss')
						let duration = parseInt(station.durationInMins)
						while (start.format('HH:mm') < end.format('HH:mm')) {
							sessionList.push([station.station_id, station.role_id, start.format('HH:mm'),
							start.add(duration, 'minutes').format('HH:mm'), station.capacity, date, date
							])
						}
					}
					// console.log(sessionList)
					sql = 'INSERT INTO sessions (station_id, role_id, session_start, ' +
						'session_end, capacity, date_added, date_updated) VALUES ?'
					return connection.query(sql, [sessionList])
				})
				.then(() => {
					connection.release()
					console.log('Sessions Data Is Seeded')
				})
				.catch((err) => {
					console.log(err)
				})
		})
		return delay(500)
	},
	seedAvailableSessions: function () {
		let sql = 'Select max(session_date) as date from available_sessions where session_date = current_date()'
		pool.getConnection().then(function (connection) {
			connection.query(sql)
				.then((results) => {
					if (results[0].date) {
						return Promise.reject('Available Sessions Data Was Seeded')
					}
					let date = new Date()
					date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
					sql = 'INSERT INTO available_sessions (session_date, session_id, station_id, role_id, noBooked) '
						+ 'SELECT current_date(), session_id, station_id, role_id, 0 FROM sessions'
					return connection.query(sql)
				})
				.then((results) => {
					console.log('Successfully Seed Available Sessions For Today')
					connection.release()
				})
				.catch((err) => {
					console.log(err)
				})
		})
	}
}