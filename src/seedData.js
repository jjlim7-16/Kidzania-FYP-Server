const mysql = require('mysql')
const moment = require('moment')
const db = require('./databasePool')
const pool = db.getPool()

module.exports = {
  seedSessions: function() {
    let sql = 'Select s.station_id, s.station_name, role_name, s.station_start, s.station_end, ' +
      's.durationInMins, capacity From stations s, station_roles sr where s.station_id = sr.station_id'
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
            stationList.push([station.station_id, station.role_name, start.format('HH:mm'),
            start.add(duration, 'minutes').format('HH:mm'), station.capacity, date, date
            ])
          }
        }
        sql = 'INSERT INTO sessions (station_id, role_name, session_start, ' +
          'session_end, capacity, date_added, date_updated) VALUES ?'
        return connection.query(sql, [stationList])
      })
      .then((rows) => {
        console.log(rows)
      })
      .catch((err) => {
        throw err
      })
    })
  },
  seedAvailableSessions: function() {
    let date = new Date()
    date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    let sql = 'Select session_date From available_booking_slots where session_date = ' + date +
              ' Having COUNT(1)'
    pool.getConnection().then(function(connection) {
      connection.query(sql)
      .then((rows) => {
        if (rows.length == 0) {
          sql = 'Select session_id, station_id, role_name, ' +
            'session_start, session_end, capacity From sessions'
          return connection.query(sql)
        }
      })
      .then((rows) => {
        let sessionList = []
        for (var x in rows) {
          let session = rows[x]
          console.log(session)
          sessionList.push([session.session_id, date, session.station_id, session.role_name,
          session.capacity, 0, 0
          ])
        }
        console.log(sessionList)
        sql = 'INSERT INTO available_booking_slots (session_id, session_date, station_id, role_name, ' +
          'capacity, noBooked, noOfVip) VALUES ?'
        return connection.query(sql, [sessionList])
      })
      .then((rows) => {
        console.log(rows)
      })
      .catch((err) => {
        console.log(err)
        console.log('Sessions Data Is Seeded')
      })
    })
  }
}
