import { io } from 'socket.io-client';

let socket = null;
export function initialize() {
	if (socket == null) {
		socket = io('https://api.riseupmora.com/', { rejectUnauthorized: false });
		socket.on('disconnect', (reason) => {
			console.log(reason);
			socket.connect();
		});
	}
	return socket;
}

export function addToRoom(props) {
	if (props.usertype.toLowerCase() === 'admin') {
		socket.emit('subscribe', 'admin', 'name');
	} else if (props.hasOwnProperty('userId') && props.userId > 0) {
		if (props.usertype.toLowerCase() === 'volunteer') {
			socket.emit('subscribe', 'volunteer', parseInt(props.userId));
		} else if (props.usertype.toLowerCase() === 'panel') {
			socket.emit('subscribe', 'panel', parseInt(props.userId));
		}
	}
}

export function getSocket(props) {
	if (socket == null) {
		if (props !== undefined) {
			if (props.hasOwnProperty('userId') && props.userId > 0) {
				socket = initialize();
				addToRoom(props);
			}
		} else {
			socket = initialize();
		}
	}
	return socket;
}
