import { io } from 'socket.io-client';

let socket = null;
export function initialize() {
	if (socket == null) {
		socket = io('http://ieee-mock.us-east-2.elasticbeanstalk.com/',{secure: true});
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
