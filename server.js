// Setup basic express server var express = require('express'); 
var app = express(); var path = require('path'); 
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 
var port = process.env.PORT || 3000; 
const ServerHelper = require('./server-helper.js'); 
const CronJob = require('cron').CronJob; 
const serverHelper = new ServerHelper(CronJob); 
const debugMode = Array.from(process.argv.map( (arg)=>arg.trim().toLowerCase() )).includes("debug"); 
const LOGGER = require("./javascript/modules/logger")(debugMode); 
server.listen(port, () => { console.log('Server listening at port %d', port); });
// Routing
app.use(express.static(path.join(__dirname, 'public'))); 
app.get('', function(request, response) { response.sendFile(__dirname + '/views/index.html'); }); 
app.get('/learn', function(request, response) { response.sendFile(__dirname + '/views/learn.html'); }); 
app.get('/faq', function(request, response) { response.sendFile(__dirname + '/views/faq.html'); }); 
app.get('/create', function(request, response) { response.sendFile(__dirname + '/views/create_game.html'); }); 
app.get('/join', function(request, response) { response.sendFile(__dirname + '/views/join_game.html'); }); 
app.get('/:code', function(request, response) { response.sendFile(__dirname + '/views/game.html'); }); 
// Starts the server. 
server.listen(process.env.PORT || 5000, function() { console.log('Starting server on port 5000'); }); 
// Chatroom 
var numUsers = 0; 
io.on('connection', (socket) => { var addedUser = false; 
    // when the client emits 'new message', this listens and executes 
       socket.on('new message', (data) => { 
         // we tell the client to execute 'new message' 
         socket.broadcast.emit('new message', { username: socket.username, message: data }); }); 
                                 / Dependencies
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const ServerHelper = require('./server-helper.js');
const secure = require('express-force-https');
app.use(secure);

// Link websocket interaction functions, separated to aid testing
const CronJob = require('cron').CronJob;
const serverHelper = new ServerHelper(CronJob);

const debugMode = Array.from(process.argv.map( (arg)=>arg.trim().toLowerCase() )).includes("debug");
const LOGGER = require("./javascript/modules/logger")(debugMode);

app.set('port', 5000);

app.use('/javascript', express.static(__dirname + '/javascript')); // Routing
app.use('/assets', express.static(__dirname + '/assets')); // Routing
app.use('/stylesheets', express.static(__dirname + '/stylesheets')); // Routing
app.use('/node_modules/socket.io-client', express.static(__dirname + '/node_modules/socket.io-client')); // Routing
app.get('', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

app.get('/learn', function(request, response) {
    response.sendFile(__dirname + '/views/learn.html');
});

app.get('/faq', function(request, response) {
    response.sendFile(__dirname + '/views/faq.html');
});

app.get('/create', function(request, response) {
    response.sendFile(__dirname + '/views/create_game.html');
});

app.get('/join', function(request, response) {
    response.sendFile(__dirname + '/views/join_game.html');
});

app.get('/:code', function(request, response) {
    response.sendFile(__dirname + '/views/game.html');
});

// Starts the server.
server.listen(process.env.PORT || 5000, function() {
    console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
    socket.on('newGame', function(game, onSuccess) {
        serverHelper.newGame(game, onSuccess);
    });
    socket.on('joinGame', function(playerInfo) {
        serverHelper.joinGame(playerInfo, socket);
    });
    // send the game state to the client that requested it
    socket.on('requestState', function(data) {
        serverHelper.requestState(data, socket);
    });
    socket.on('startGame', function(gameData) {
        serverHelper.startGame(gameData);
    });
    socket.on('pauseGame', function(code) {
        serverHelper.pauseGame(code);
    });
    socket.on('resumeGame', function(code) {
        serverHelper.resumeGame(code);
    });
    socket.on('killPlayer', function(id, code) {
        serverHelper.killPlayer(id, code);
    });
});// when the client emits 'add user', this listens and executes socket.on('add user', (username) => { if (addedUser) return; // we store the username in the socket session for this client socket.username = username; ++numUsers; addedUser = true; socket.emit('login', { numUsers: numUsers }); // echo globally (all clients) that a person has connected socket.broadcast.emit('user joined', { username: socket.username, numUsers: numUsers }); }); // when the client emits 'typing', we broadcast it to others socket.on('typing', () => { socket.broadcast.emit('typing', { username: socket.username }); }); // when the client emits 'stop typing', we broadcast it to others socket.on('stop typing', () => { socket.broadcast.emit('stop typing', { username: socket.username }); }); // when the user disconnects.. perform this socket.on('disconnect', () => { if (addedUser) { --numUsers; // echo globally that this client has left socket.broadcast.emit('user left', { username: socket.username, numUsers: numUsers }); } }); //server icin ekledigim kisim socket.on('newGame', function(game, onSuccess) { serverHelper.newGame(game, onSuccess); }); socket.on('joinGame', function(playerInfo) { serverHelper.joinGame(playerInfo, socket); }); // send the game state to the client that requested it socket.on('requestState', function(data) { serverHelper.requestState(data, socket); }); socket.on('startGame', function(gameData) { serverHelper.startGame(gameData); }); socket.on('pauseGame', function(code) { serverHelper.pauseGame(code); }); socket.on('resumeGame', function(code) { serverHelper.resumeGame(code); }); socket.on('killPlayer', function(id, code) { serverHelper.killPlayer(id, code); }); });
