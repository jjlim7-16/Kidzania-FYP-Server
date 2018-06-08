const mysql = require('mysql')
const moment = require('moment')
const db = require('./databasePool')
const pool = db.getPool()

module.exports = {
	seedSessions: function(id) {
		let sql = 'Select s.station_id, role_id, s.station_start, s.station_end, ' +
			's.durationInMins, capacity From stations s, station_roles sr where s.station_id = sr.station_id'
			//+ ' AND s.station_id = ' + id
		pool.getConnection().then(function(connection) {
			connection.query(sql)
				.then((rows) => {
					let stationList = []
					let date = new Date()
					date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
					for (var x in rows) {
						let station = rows[x]
						let start = moment(station.station_start, 'HH:mm:ss')
						let end = moment(station.station_end, 'HH:mm:ss')
						let duration = parseInt(station.durationInMins)
						while (start.format('HH:mm') < end.format('HH:mm')) {
							stationList.push([station.station_id, station.role_id, start.format('HH:mm'),
								start.add(duration, 'minutes').format('HH:mm'), station.capacity, date, date
							])
						}
					}
					console.log(stationList)
					sql = 'INSERT INTO sessions (station_id, role_id, session_start, ' +
						'session_end, capacity, date_added, date_updated) VALUES ?'
					return connection.query(sql, [stationList])
				})
				.then((rows) => {
					console.log(rows)
					connection.release()
				})
				.catch((err) => {
					console.log(err.code)
				})
		})
	},
	seedAvailableSessions: function() {
		let date = new Date()
		date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
		let sql = 'INSERT INTO available_sessions (session_date, session_id, station_id, role_id, noBooked) '
		+ 'SELECT current_date(), session_id, station_id, role_id, 0 FROM sessions'
		pool.getConnection().then(function(connection) {
			connection.query(sql)
				.then((rows) => {
					console.log(rows)
					connection.release()
				})
				.catch((err) => {
					console.log(err.code)
					console.log('Sessions Data Is Seeded')
				})
		})
	}
}