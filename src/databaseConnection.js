const mysql = require('mysql')
let connection
module.exports = {
	getConnection: function () {
		if (connection) return connection
		connection = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '12345',
			database: 'kidzania_fyp'
		})
		return connection
	}
}