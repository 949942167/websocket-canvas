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
var users = [];

function updateUsers(type,socket){
	if(type == "add"){
		let length = users.length;
		console.log(length);
		for(let i=0;i < length;i++){
			if(users[i].id == socket.id){
				users.splice(i,1);
				break;
			}
		}
		users.push({id:socket.id,toRoomId:socket.id})
	}else if(type == "del"){
		let length = users.length;
		for(let i=0;i < length;i++){
			if(users[i].id == socket.id){
				users.splice(i,1);
				break;
			}
		}
	}
}
io.on('connection', function(socket) {

	//设备连接成功后加入users，并触发login事件
	updateUsers("add",socket);
	io.emit('login', users);

	//断开连接后更新users
	socket.on('disconnect', function(){
		updateUsers("del",socket);
		io.emit('login', users);

	});

	//画画，让某一个人猜或者所有人猜
	socket.on('draw', function(data,cb) {
		if(data.type == "draw"){
			if(data.toRoomId != ""){
				socket.broadcast.to(data.toRoomId).emit('draw',data);
			}else{
				io.emit('draw', data);
			}
		}
		cb("form server");
	});
	//停笔，让某一个人猜或者所有人猜
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
	//清空画布，让某一个人猜或者所有人猜
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
});