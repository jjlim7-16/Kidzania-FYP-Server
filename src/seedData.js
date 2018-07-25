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
			sr.durationInMins, capacity From stations s, station_roles sr 
			where s.station_id = sr.station_id AND s.station_id = ?;`
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
							start.add(duration, 'minutes').format('HH:mm'), role.capacity ])
						}
					}
					sql = `INSERT INTO sessions (station_id, role_id, session_start, session_end, capacity) VALUES ?`
					return connection.query(sql, [sessionList])
				})
				.then(() => {
					console.log('Successfully Seed New Sessions Data')
				})
				.catch((err) => {
					console.log(err.code)
				})
				connection.release()
		})
		return Promise.resolve('Success')
	},
	seedSessions: function () {
		let sql = `Select s.station_id, role_id, s.station_start, s.station_end, sr.durationInMins, 
			capacity From stations s, station_roles sr where s.station_id = sr.station_id; `
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
							start.add(duration, 'minutes').format('HH:mm'), station.capacity])
						}
					}
					// console.log(sessionList)
					sql = 'INSERT INTO sessions (station_id, role_id, session_start, ' +
						'session_end, capacity) VALUES ?'
					return connection.query(sql, [sessionList])
				})
				.then(() => {
					console.log('Sessions Data Is Seeded')
				})
				.catch((err) => {
					console.log(err)
				})
				connection.release()
		})
		return delay(500)
	},
	seedAvailableSessions: function () {
		let sql = 'Select max(session_date) as date from available_sessions where session_date = current_date()'
		pool.getConnection().then(function (connection) {
			connection.query(sql)
				.then(results => {
					if (results[0].date) {
						return Promise.reject('Available Sessions Data Was Seeded')
					}
					sql = `INSERT INTO available_sessions 
					(session_date, session_id, station_id, role_id, noBooked, capacity)
					SELECT current_date(), session_id, s.station_id, s.role_id, 0, capacity
					FROM sessions s LEFT JOIN booking_limit b ON s.role_id = b.role_id 
					AND b.session_date = current_date()
					INNER JOIN stations st ON st.station_id = s.station_id AND st.is_active = true;`
					return connection.query(sql)
				})
				.then(() => {
					console.log('Successfully Seed Available Sessions For Today')
				})
				.catch(err => {
					console.log(err)
				})
				connection.release()
				// console.log(pool.pool._allConnections.length)
				// console.log(pool.pool._acquiringConnections.length)
				// console.log(pool.pool._freeConnections.length)
		})
	}
}