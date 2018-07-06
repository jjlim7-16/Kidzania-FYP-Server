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
			password: '',
			database: 'kidzania_fyp_v2'
		})
		pool.on('release', function(connection) {
			console.log('Connection %d released', connection.threadId);
		})

		pool.on('acquire', function(connection) {
			console.log('Connection %d acquired', connection.threadId);
		})
		return pool
	}
}