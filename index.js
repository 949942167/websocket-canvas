var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8081);
console.log("开启socket.io")

function handler(req, res) {
	fs.readFile(__dirname + '/index.html',
		function(err, data) {
			if(err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			res.writeHead(200);
			res.end(data);
		});
}
//问题
var text;
var users = [];
//简历socket连接
io
// .of("/a")
	.on('connection', function(socket) {

		//update users
		users.push({id:socket.id,toRoomId:socket.id});
		io.emit('login', users);
		
		socket.on('disconnect', function(){
			console.log('user disconnected');
			//todo update users
		});
		socket.on('draw', function(data,cb) {
			// console.log(data);
			// socket.volatile.emit('paint1', data);
			// socket.broadcast.emit('paint1', data);
			//向所有客户端广播
			//
			console.log("---------draw-------");
			console.log(data);

			if(data.type == "draw"){
				if(data.toRoomId != ""){
					socket.broadcast.to(data.toRoomId).emit('draw',data);
				}else{
					io.emit('draw', data);
				}
			}
			cb("form server");
		});
		//停笔
		socket.on('stop', function(data) {
			console.log(data);
			// io.emit('paint', data);
			if(data.type == "stop"){
				if(data.toRoomId != ""){
					socket.broadcast.to(data.toRoomId).emit('stop',data);
				}else{
					io.emit('stop', data);
				}
			}
		});
		//清空画布
		socket.on('clear', function(data) {
			console.log(data);
			// io.emit('clear', data);
			if(data.type == "clear"){
				if(data.toRoomId != ""){
					socket.broadcast.to(data.toRoomId).emit('clear',data);
				}else{
					io.emit('clear', data);
				}
			}
		});
		//接受画图的描述
		socket.on('ask', function(data) {
			console.log('ask:' + data);
			//把答案保存起来跟猜图回复进行判断
			text = data;
			if(data.type == "ask"){
				if(data.toRoomId != ""){
					socket.broadcast.to(data.toRoomId).emit('ask',data);
				}else{
					io.emit('ask', data);
				}
			}
		});
	});