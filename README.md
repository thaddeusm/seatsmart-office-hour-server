![Seatsmart Icon](https://seatsmart.now.sh/img/logo.b38f8b88.svg)

# Seatsmart Office Hour Server
This realtime server powers video conferencing functionality within the desktop application 
[Seatsmart](https://github.com/thaddeusm/seatsmart-FHSU).  

## Scope
When Internet access is available, instructors can use the 
this feature to hold realtime video/audio meetings.  Data is encrypted during transport 
and this information is not stored in any cloud database.

## Core Dependencies
### Express JS
[repo](https://github.com/expressjs/express)

Express JS is a "fast, unopinionated, minimalist web framework for node".  The 
framework is used to provide helpful methods for listening for and responding to 
server requests.

### Socket.io
[repo](https://github.com/socketio/socket.io)

Socket.io powers bidirectional communication within an Express server, providing 
channels (or "rooms") for a Seatsmart host to communicate with their remote 
device.

## Running on a Local Machine
### to install dependencies
```
$ npm install
```
or
```
$ yarn
```

### to start the server
```
$ npm start
```
or
```
$ yarn start
```