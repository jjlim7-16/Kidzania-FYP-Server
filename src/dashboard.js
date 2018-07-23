const axios = require('axios')
const os = require('os')
const hostname = os.networkInterfaces()['Wi-Fi'][1].address
// const hostname = '25.37.100.106'

module.exports = {
	getBookingCount: async socket => {
		try {
			const res = await axios.get(`http://${hostname}:8000/dashboard/count`)
			socket.emit('getBookingCount', res.data)
		} catch (error) {
			console.error(`Error: ${error.code}`)
		}
	},
	getAvgBookings: async socket => {
		try {
			const res = await axios.get(`http://${hostname}:8000/dashboard/getAvgBookings`)
			socket.emit('getAvgBookings', res.data)
		} catch (error) {
			console.error(`Error: ${error.code}`)
		}
	},
	getBookingByDay: async socket => {
		try {
			const res = await axios.get(`http://${hostname}:8000/dashboard/getBookingByDay`)
			socket.emit('getBookingByDay', res.data)
		} catch (error) {
			console.error(`Error: ${error.code}`)
		}
	},
	getBookingByDate: async socket => {
		try {
			const res = await axios.get(`http://${hostname}:8000/dashboard/getBookingByDate`)
			socket.emit('getBookingByDate', res.data)
		} catch (error) {
			console.error(`Error: ${error.code}`)
		}
	},
	getBookingByStation: async socket => {
		try {
			const res = await axios.get(`http://${hostname}:8000/dashboard/getBookingByStation`)
			socket.emit('getBookingByStation', res.data)
		} catch (error) {
			console.error(`Error: ${error.code}`)
		}
	},
	getBookingByTime: async (socket) => {
		try {
			const res = await axios.get(`http://${hostname}:8000/dashboard/getBookingByTime`)
			socket.emit('getBookingByTime', res.data)
		} catch (error) {
			console.error(`Error: ${error.code}`)
		}
	}
}
