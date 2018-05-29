const mysql = require('promise-mysql')
let pool
module.exports = {
	getPool: function() {
		if (pool) return pool
		pool = mysql.createPool({
			connectionLimit: 10,
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'kidzania_fyp'
		})
		return pool
	}
}