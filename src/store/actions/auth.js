import axios from '../../axios-SE';
import * as actionTypes from './actionTypes';
import { loginRoute, authRequestTimeoutSec } from '../../shared/consts';
import { initialize } from '../../services/socket';
let authRequestInterceptor;

const authStart = () => {
	return {
        type: actionTypes.AUTH_START
	};
};

const authSuccess = (token, type, userId) => {
    authRequestInterceptor = axios.interceptors.request.use(request => {
		request.headers.Authorization = `Bearer ${token}`;
		return request;
	});
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: token,
		usertype: type,
		user: userId,
	};
};

const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
        error: error
	};
};

export const authLogout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('usertype');
	localStorage.removeItem('user');
	localStorage.removeItem('expirationDate');
	axios.interceptors.request.eject(authRequestInterceptor);
	return {
        type: actionTypes.AUTH_LOGOUT
	};
};

const checkAuthTimeout = (expirationTime) => (dispatch) => {
	setTimeout(() => {
		// dispatch(authLogout());
		console.log("log again")
    }, expirationTime * 1000)
};

export const auth = (email, password) => (dispatch) => {
	dispatch(authStart());
	let authData = {
		email: email,
		password: password,
    }
	let url = loginRoute;

    axios.post(url,
        authData)
        .then((response) => {
		if (response.data.success) {
			const expirationDate = new Date(new Date().getTime() + authRequestTimeoutSec * 1000);
			localStorage.setItem('token', response.data.token);
			localStorage.setItem('usertype', response.data.type);
			localStorage.setItem('user', response.data.panelID);
			localStorage.setItem('expirationDate', expirationDate);
			let socket = initialize();
			if (response.data.type.toLowerCase() === 'admin') {
				socket.emit('subscribe', 'admin','name');
			} else if (response.data.type.toLowerCase() ==='volunteer') {
				socket.emit('subscribe', 'volunteer',response.data.panelID);
			} else {
				socket.emit('subscribe', 'panel', response.data.panelID);
			}
			dispatch(authSuccess(response.data.token, response.data.type, response.data.panelID));
			// dispatch(checkAuthTimeout(authRequestTimeoutSec));
		} else {
			dispatch(authFail('Invalid Username or Password'));
		}
            if (response.error){
			dispatch(authFail('Invalid Username or Password'));
		}
	});
}

export const authCheckState = () => (dispatch) => {
	const token = localStorage.getItem('token');
	if (!token) {
		dispatch(authLogout());
	} else {
		const expirationDate = new Date(localStorage.getItem('expirationDate'));
		if (expirationDate <= new Date()) {
			dispatch(authLogout());
		} else {
			const usertype = localStorage.getItem('usertype');
			const userID = localStorage.getItem('user');
			dispatch(authSuccess(token, usertype, userID));
			// dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
		}
	}
}
