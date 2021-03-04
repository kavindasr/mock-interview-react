import axios from "../axios-SE";

// Utility functions
export const getRequest = async (uri,body) => {
	try {
		console.log(uri);
		let response=null;
		if(body){
			console.log(body);
			response = await axios.get(uri,body);
		}else{
			response = await axios.get(uri);
		}

		return {
			data: response.data,
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error,
		};
	}
};

export const postRequest = async (uri, data) => {
	try {
		console.log(uri)
		console.log(data)
		let response = await axios.post(uri, data);

		return {
			data: response.data,
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error,
		};
	}
};

export const deleteRequest = async (uri) => {
	try {
		let response = await axios.delete(uri);

		return {
			data: response.data,
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error,
		};
	}
};

export const putRequest = async (uri, data) => {
	try {
		console.log(uri);
		console.log(data)
		let response = await axios.put(uri, data);
		console.log(response);

		return {
			data: response.data,
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error,
		};
	}
};
