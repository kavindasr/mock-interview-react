import { io } from 'socket.io-client';

let socket = null;
export function initialize() {
	if (socket == null) {
		socket = io('https://api.riseupmora.com/',{rejectUnauthorized:false});
		socket.on("disconnect", (reason) => {
			if (reason === "io server disconnect") {
			  // the disconnection was initiated by the server, you need to reconnect manually
			  socket.connect();
			}
			// else the socket will automatically try to reconnect
		  });
	}
	return socket;
}

export function getSocket() {
	if (socket == null) {
		socket = initialize();
	}
	return socket;
}
// io.on('connection', socket => {
//     socket.join('Admin');
//   });
// io.on("details", (...args) => {

// });
// io.on("details", (...args) => {

// });
// io.on("details", (...args) => {

// });
// io.on("details", (...args) => {

// });
