const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const RTCMultiConnectionServer = require('rtcmulticonnection-server')

io.on('connection', socket => {
	console.log('New Socket connected: ', socket.id)
	RTCMultiConnectionServer.addSocket(socket);
})

server.listen(4000, () => {
  console.log('The server is running')
})