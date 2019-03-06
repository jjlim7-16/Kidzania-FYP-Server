const mysql = require('promise-mysql')
// const password = 'P@ssw0rd'
const password = '12345'
let pool
module.exports = {
	getPool: function() {
		if (pool) return pool
		pool = mysql.createPool({
			connectionLimit: 1000,
			multipleStatements: true,
			host: 'localhost',
			user: 'root',
			password: password,
			database: 'kidzania_v3'
		})
		return pool
	}
}
