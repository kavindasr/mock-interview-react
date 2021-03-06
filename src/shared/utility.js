export const INDEX = 'INDEX';

/**
 * Used to update objects immutabaly
 * @param {object} object the original JS object
 * @param {object} updates updates to be made
 */
export const updateObject = (object, updates) => {
	return {
		...object,
		...updates,
	};
};

/**
 * Used to update an array immutabaly
 * @param {array} array the original JS array
 * @param {object} item item to be added
 */
export const addItemToArray = (array, item) => {
	let newArray = [...array];
	newArray.push(item);
	return newArray;
};

export const addItemRemoveDuplicate = (idtype, array, newarr) => {
	let result = [];
	newarr.forEach((item) => {
		let index = array.findIndex((entry) => entry[idtype] === item[idtype]);
		if (index < 0) {
			result.push(item);
		}
	});
	return result;
};
/**
 * Used to remve item from an array immutabaly
 * @param {array} array the original JS array
 * @param {string} fieldName name of the field to identify the object from
 * @param {value} value value of the field
 */
export const removeItemFromArray = (array, fieldName, value) => {
	if (fieldName === INDEX) {
		let arr = array.filter((item, index) => {
			return index !== value;
		});

		return arr;
	}
	let newArr = array.filter((item) => {
		return item[fieldName] !== value;
	});

	return newArr;
};

/**
 * Used to replace item from an array immutabaly
 * @param {array} array the original JS array
 * @param {string} fieldName name of the field to identify the object from
 * @param {value} value item to be assigned
 */
export const replaceItemInArray = (array, fieldName, newItem, index) => {
	if (fieldName === INDEX) {
		let newArray = [...array];
		newArray[index] = newItem;
		return newArray;
	} else {
		return array.map((item) => {
			if (item[fieldName] === newItem[fieldName]) {
				return newItem;
			}
			return item;
		});
	}
};

/**
 * Used to update an item from an array immutabaly
 * @param {array} array the original JS array
 * @param {string} fieldName name of the field to identify the object from
 * @param {value} value item to be assigned
 */
export const updateItemInArray = (array, fieldName, newItem) => {
	return array.map((item) => {
		if (item[fieldName] === newItem[fieldName]) {
			return { ...item, ...newItem };
		}
		return item;
	});
};

/**
 * Returns a promise which will resolve after a given number of milliseconds
 * @param {number} milliseconds the original JS array
 */
export const sleep = (milliseconds) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

/**
 * Returns a boolean given an object containing the validity status of each input
 * @param {object} inputIsValid a js object with validity info of a function
 */
export const formIsValid = (inputIsValid) => {
	let isValid = true;
	Object.values(inputIsValid).forEach((value) => {
		isValid = isValid && value;
	});

	return isValid;
};

/**
 * Returns a string with the first letter capitalized
 * @param {string} string a string
 */
export const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * This method can be used to extract a
 * nested value from an object given a string path
 * eg: "client.name"
 * @param {object} obj
 * @param {string} path
 */
export const getNestedValueByPath = (obj, path) => {
	let pathArray = path.split('.');
	let value = { ...obj };
	for (let i = 0; i < pathArray.length; i++) {
		value = value[pathArray[i]];
		if (!value) {
			break;
		}
	}
	return value;
};
