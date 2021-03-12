import { io } from 'socket.io-client';

let socket = null;
export function initialize() {
	if (socket == null) {
		socket = io('https://api.riseupmora.com/');
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
