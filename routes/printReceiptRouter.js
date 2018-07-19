// const escpos = require('escpos');
// const express = require('express')
// const bodyParser = require('body-parser')
// const moment = require('moment')
// const cors = require('cors')
// const db = require('../src/databasePool')
// const pool = db.getPool()

// //console.log(escpos.USB.findPrinter());

// const device = new escpos.USB(0x04B8,0x0E02);
// const printer = new escpos.Printer(device);
// // Re-uses existing if already created, else creates a new one

// const router = express.Router()
// router.use(bodyParser.urlencoded({
// 	limit: '50mb',
// 	extended: true,
// 	parameterLimit: 100000
// }))
// router.use(bodyParser.json({
// 	limit: '50mb'
// }))

// router.options('*', cors())
// router.use(cors())

// // router.route('/')
// // .all((req, res, next) => {
// // 	res.statusCode = 200
// // 	res.setHeader('Content-Type', 'text/plain')
// // 	next() //Continue on to the next method -> .get(...)
// // })
// // .get((req, res) => {

// // })

// router.get('/:bookingid', function (req, res) {
//     var bookingidStr = req.params.bookingid
//     let bookingid = parseInt(bookingidStr)
// 	let sql = 'Select b.session_date, se.session_start, se.session_end, st.station_name,sr.role_name, queue_no '+ 
//     'From booking_details b, sessions se, stations st, station_roles sr '+
//     'where b.session_id = se.session_id and b.station_id = st.station_id and '+
//     'st.station_id = sr.station_id and sr.role_id = b.role_id and b.booking_id = ?'
// 	//get details of the booking by booking id for printing
// 	pool.getConnection().then(function (connection) {
// 		connection.query(sql, bookingid)
// 		.then((rows) => {
//             let station_name = rows[0].station_name
//             let role_name = rows[0].role_name
//             let queue_no = rows[0].queue_no
//             let session_date = rows[0].session_date
//             let start_time = rows[0].session_start
//             let end_time = rows[0].session_end;

//             escpos.Image.load("logo.png", function(image) {
//                 device.open(function() {
//                     printer
//                     .align('ct')
//                     .raster(image, 'dwdh')
//                     .font('b')
//                     .style('bu')
//                     .size(1, 1)
//                     .text(" ")
//                     .text("Welcome to KidZania Singapore")
//                     .text("------------------------------------")
//                     .size(2, 2)
//                     .text(" ")
//                     .text(station_name)
//                     .text(" ")
//                     .text(role_name)
//                     .size(1, 1)
//                     .text(" ")
//                     .text("Date: "+session_date)
//                     .text(" ")
//                     .text("Session Time:")
//                     .size(2, 2)
//                     .text(" ")
//                     .text(start_time+" - "+end_time)
//                     .text(" ")
//                     .size(1, 1)
//                     .text("Queue Number:")
//                     .text(" ")
//                     .size(5, 5)
//                     .text(queue_no)
//                     .size(1, 1)
//                     .text(" ")
//                     .text("PleeZ report 5 mins earlier")
//                     .text("PleeZ do not lose the receipt")
//                     .text("Failure to comply may result in denied entry")
//                     .text(" ")
//                     .cut()
//                     .close();
//                 });
//             });

//             res.json(rows)
// 		})
// 		.catch(err => {
// 			res.statusMessage = err
// 			res.status(400).end()
// 		})
// 	})
// })

// module.exports = router
