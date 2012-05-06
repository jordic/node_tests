


var  express = require('express')
    , app = express.createServer()
    , io = require('socket.io').listen(app)
    , fs = require('fs')
    , users = {}
    , pos = {}
    , settings = require(__dirname + '/local_settings')
    

app.listen(settings.server_port, settings.server_ip);


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.use("/static", express.static(__dirname + '/static'));

io.set('log level', 1);

io.sockets.on('connection', function(socket){
    
    //console.log('conection...')
    
    var current = socket.store.id
    if(!users[current]) 
        users[current] = current;
    //console.log(users)
    socket.broadcast.emit('new', {'id': current})
    
    
    //socket.emit('news', {hello:'world'});
    socket.on('move', function(data){
        //users[data.id] = data
        socket.broadcast.emit('update', data )
        pos[data.id] = data
        //console.log(data)
    }) 
    
    socket.on('disconnect', function () { 
        delete users[current]
        socket.broadcast.emit('delete', current)
    });
   
    socket.emit('id', current)
   
    var all = []
    for ( k in users )
    {   
        if( k != current )
            all.push( k )
    }
    if( all.length > 0) {
        //console.log( 'init',  all )
        socket.emit('init', all )
    }
    for (var r=0; r<all.length; r++)
    {
        socket.emit('update', pos[all[r]])
    }
    
   
   
   
});
