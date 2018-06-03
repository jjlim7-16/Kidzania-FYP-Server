const mysql = require('promise-mysql')
let pool
module.exports = {
	getPool: function () {
		if (pool) return pool
		pool = mysql.createPool({
			connectionLimit: 100,
			host: 'localhost',
			user: 'root',
			password: '12345',
			database: 'kidzania_fyp'
		})
		return pool
	}
}
