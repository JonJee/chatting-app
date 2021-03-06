let app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(4001, function() {
    console.log("Socket IO server listening on port 4001");
});

app.get('/', (req, res) => {
    res.send('Hello World!!!!');
});

io.on('connection', function(socket) {

    // 접속한 클라이언트의 정보가 수신되면
    socket.on('login', function(data) {
      console.log('Client logged-in:\n name: ' + data.name + '\n userid: ' + data.id);
  
      // socket에 클라이언트 정보를 저장한다
      socket.name = data.name;
      socket.userid = data.id;
  
      // 접속된 모든 클라이언트에게 메시지를 전송한다
      io.emit('login', data.name );
    });
  
    // 클라이언트로부터의 메시지가 수신되면
    socket.on('chat', function(data) {
      console.log('%s: %s', socket.name, data.msg);
  
      var msg = {
        from: {
          name: socket.name,
          userid: socket.userid
        },
        msg: data.msg
      };
  
      // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
      socket.broadcast.emit('chat', msg);
  
      // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
      // socket.emit('s2c chat', msg);
  
      // 접속된 모든 클라이언트에게 메시지를 전송한다
      // io.emit('s2c chat', msg);
  
      // 특정 클라이언트에게만 메시지를 전송한다
      // io.to(id).emit('s2c chat', data);
    });
  
    // force client disconnect from server
    socket.on('forceDisconnect', function() {
      socket.disconnect();
    })
  
    socket.on('disconnect', function() {
      console.log('user disconnected: ' + socket.name);
    });
  });