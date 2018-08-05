const mysql = require('promise-mysql')
let pool
module.exports = {
	getPool: function() {
		if (pool) return pool
		pool = mysql.createPool({
			connectionLimit: 1000,
			multipleStatements: true,
			host: 'localhost',
			user: 'root',
			password: 'P@ssw0rd',
			database: 'kidzania_v3'
		})
		return pool
	}
}