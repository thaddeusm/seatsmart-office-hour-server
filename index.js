const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const simpleID = require('simple-id')

// dictionary to keep track of rooms and sockets
var roomDictionary = {}

// store closed rooms to force exit remote connections
var closedRooms = []

const roomClosed = function(roomToCheck) {
  let check = false

  for (let i=0; i<closedRooms.length; i++) {
    if (dictionary[i] == roomToCheck) {
      check = true
      break
    }
  }

  return check
}

const roomExists = function(roomToCheck) {
  let check = false

  let registeredRooms = Object.values(roomDictionary)

  for (let i=0; i<registeredRooms.length; i++) {
    if (registeredRooms[i] == roomToCheck) {
      check = true
      break
    }
  }

  return check
}

io.on('connection', socket => {
  console.log('a user connected')

  // set up a room
  socket.on('createNewRoom', () => {
    let newID = simpleID(6, '1234567890')

    // send host to newly created room
    socket.join(newID)

    // register host in dictionary
    roomDictionary[socket.id] = newID

    // send room id back to host
    io.to(newID).emit('created', newID)
  })

  // device connects
  socket.on('joinRoom', (room) => {
    if (roomExists(room) && !roomClosed(room)) {
      socket.join(room)

      // register device in dictionary
      roomDictionary[socket.id] = room

      // send notification to new device and host
      io.to(socket.id).emit('joined', room)
      io.to(room).emit('ready', socket.id)
    } else {
      // notify user that room does not exist
      io.to(socket.id).emit('roomJoinRejected')
    }
  })

  // user sends their shortened name for identification
  socket.on('sendingUsername', (name) => {
    io.to(roomDictionary[socket.id]).emit('incomingUsername', name)
  })

  // broadcasting messages (stream)
  socket.on('message', (message) => {
  	io.to(roomDictionary[socket.id]).emit('message', message)
  })

  // reconnect
  socket.on('rejoinRoom', (room) => {
    socket.join(room)

    // reregister device in dictionary in case of id change
    roomDictionary[socket.id] = room
    

    // send notification to room
    io.to(roomDictionary[socket.id]).emit('rejoinedRoom')
  })

  // host ends session
  socket.on('endSession', () => {
    let roomID = roomDictionary[socket.id]

    // notify secondary user(s)
    io.to(roomID).emit('sessionEnded')
    closedRooms.push(roomID)

    // remove device from room
    socket.leave(roomDictionary[socket.id])
  })

  socket.on('disconnect', () => {
    // send notification to room
    io.to(roomDictionary[socket.id]).emit('deviceDisconnection')
  })

})

server.listen(4000, () => {
  console.log('The server is running')
})