const mysql = require('mysql')
const moment = require('moment')
const db = require('./databasePool')
const pool = db.getPool()

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
	seedNewSessions: function (stationID) {
		let sql = `Select st.station_id, role_id, st.station_start, st.station_end, 
			st.durationInMins, capacity From stations st, station_roles sr 
			where st.station_id = sr.station_id AND st.station_id = ?;`
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
	seedNewRoleSessions: function (roleID) {
		let sql = `Select st.station_id, role_id, st.station_start, st.station_end, 
		st.durationInMins, capacity From stations st, station_roles sr 
		where st.station_id = sr.station_id AND sr.role_id = ?;`
		pool.getConnection().then(function (connection) {
			connection.query(sql, roleID)
				.then((results) => {
					let sessionList = []
					let date = new Date()
					date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
					let role = results[0]
					let start = moment(role.station_start, 'HH:mm:ss')
					let end = moment(role.station_end, 'HH:mm:ss')
					let duration = parseInt(role.durationInMins)
					while (start.format('HH:mm') < end.format('HH:mm')) {
						sessionList.push([role.station_id, role.role_id, start.format('HH:mm'),
						start.add(duration, 'minutes').format('HH:mm'), role.capacity ])
					}
					sql = `INSERT INTO sessions (station_id, role_id, session_start, session_end, capacity) VALUES ?`
					return connection.query(sql, [sessionList])
				})
				.then(() => {
					console.log('Successfully Seed New Role Sessions Data')
				})
				.catch((err) => {
					console.log(err)
				})
				connection.release()
		})
		return Promise.resolve('Success')
	},
	seedSessions: function () {
		let sql = `Select st.station_id, role_id, st.station_start, st.station_end, st.durationInMins, 
			capacity From stations st, station_roles sr where st.station_id = sr.station_id; `
		sql += 'Select min(session_id) as session from sessions;'
		pool.getConnection().then(function (connection) {
			connection.query(sql)
				.then((results) => {
					if (results[1][0].session) {
						return Promise.reject('Data Was Seeded')
					}
					else {
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
						sql = 'INSERT INTO sessions (station_id, role_id, session_start, ' +
							'session_end, capacity) VALUES ?'
						return connection.query(sql, [sessionList])
					}
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
		let sql = `Select max(session_date) as date from available_sessions where session_date = current_date()`
		pool.getConnection().then(function (connection) {
			connection.query(sql)
				.then(results => {
					if (results[0].date) {
						return Promise.reject('Available Sessions Data Was Seeded')
					}
					sql = `INSERT INTO available_sessions 
					(session_date, session_id, station_id, role_id, noBooked, capacity)
					SELECT date, session_id, station_id, role_id, SUM(noBooked) as noBooked, capacity 
					FROM (SELECT current_date() as date, ss.session_id, ss.station_id, ss.role_id, 
					CASE WHEN noOfReservedSlots IS NULL THEN 0 ELSE noOfReservedSlots END as noBooked, capacity
					FROM sessions ss
					INNER JOIN stations st ON st.station_id = ss.station_id AND st.is_active = true
					LEFT JOIN reservations r ON r.session_id = ss.session_id AND r.session_date = current_date()) x
					GROUP BY session_id;`
					return connection.query(sql)
				})
				.then((results) => {
					console.log('Successfully Seed Available Sessions For Today')
				})
				.catch(err => {
					console.log(err)
				})
				connection.release()
		})
	},
	seedNewAvailableSessions: function (station_id) {
		let sql = `Select max(session_date) as date from available_sessions where session_date = current_date()
		AND station_id = ${station_id}`
		console.log(sql)
		pool.getConnection().then(function (connection) {
			connection.query(sql)
				.then(results => {
					if (results[0].date) {
						return Promise.reject('Available Sessions Data Was Seeded')
					}
					sql = `INSERT INTO available_sessions 
					(session_date, session_id, station_id, role_id, noBooked, capacity)
					SELECT current_date(), ss.session_id, ss.station_id, ss.role_id, 
					CASE WHEN noOfReservedSlots IS NULL THEN 0 ELSE noOfReservedSlots END as noBooked, capacity
					FROM sessions ss
					INNER JOIN stations st ON st.station_id = ss.station_id AND st.is_active = true
					AND st.station_id = ${station_id}
					LEFT JOIN reservations r ON r.session_id = ss.session_id AND r.session_date = current_date();`
					return connection.query(sql)
				})
				.then(() => {
					console.log('Successfully Seed Available Sessions For Today')
				})
				.catch(err => {
					console.log(err)
				})
				connection.release()
		})
	},
	seedNewRoleAvailableSessions: function (role_id) {
		let sql = `Select max(session_date) as date from available_sessions where session_date = current_date()
		AND role_id = ${role_id}`
		console.log(sql)
		pool.getConnection().then(function (connection) {
			connection.query(sql)
				.then(results => {
					console.log(results)
					if (results[0].date) {
						return Promise.reject('Available Sessions Data Was Seeded')
					}
					sql = `INSERT INTO available_sessions 
					(session_date, session_id, station_id, role_id, noBooked, capacity)
					SELECT current_date(), ss.session_id, ss.station_id, ss.role_id, 
					CASE WHEN noOfReservedSlots IS NULL THEN 0 ELSE noOfReservedSlots END as noBooked, ss.capacity
					FROM sessions ss
					INNER JOIN stations st ON st.station_id = ss.station_id AND st.is_active = true
					LEFT JOIN reservations r ON r.session_id = ss.session_id AND r.session_date = current_date()
					WHERE ss.role_id = ${role_id};`
					return connection.query(sql)
				})
				.then(() => {
					console.log('Successfully Seed Available Sessions For Role')
				})
				.catch(err => {
					console.log(err)
				})
				connection.release()
		})
		return Promise.resolve('Success')
	}
	// updateReservation() {
	// 	let sql = `UPDATE available_sessions SET noBooked = capacity 
	// 	WHERE session_id IN (SELECT ss.session_id FROM reservations r
	// 	INNER JOIN sessions ss ON ss.session_start >= r.reservedFrom 
	// 	AND ss.session_end <= r.reservedTo
	// 	AND ss.role_id = r.role_id
	// 	WHERE r.session_date = current_date());`
		
	// 	pool.getConnection().then(function(connection) {
	// 		connection.query(sql)
	// 		.then(() => {
	// 			console.log('Update Reservation')
	// 		})
	// 		.catch(err => {
	// 			console.log(err)
	// 		})
	// 		connection.release()
	// 	})
	// 	return Promise.resolve('Success')
	// }
}