import React from 'react';

const networkErrorHandler = (error) => {
    return {
        severity: 'error',
        message: error.toJSON().message
    }
}

const validationErrorHandler = (data) => {
    let title = "Request validation failed";
    let message = "";

    if (data.errors && data.errors.length > 0) {
        title = "Request validation failed with following errors"
        let errorItems = [];
        data.errors.forEach((validationError, index) => {
            errorItems.push(<li key={index}>{`${message}${validationError.field} ${validationError.defaultMessage}`}</li>);
        });
        message = (<ul>{errorItems}</ul>);

    }

    return {
        severity: 'error',
        title: title,
        message: message
    }
}

const badRequestErrorHandler = (error) => {
    let response = error.response;

    if (response.data && response.data.message) {
        if (response.data.message.includes('Validation failed for')) {
            return validationErrorHandler(response.data);
        }

        return {
            severity: 'error',
            message: response.data.message
        };
    }

    return {
        severity: 'error',
        message: error.message
    };
}

const defaultRequestErrorHandler = (error) => {
    let response = error.response;
    return {
        severity: 'error',
        message: response.data.message
    }
};

/**
 * Used to convert an axios error to an alert 
 * @param {error} error error to be converted
 */
const getAlertFromError = (error) => {
    if (!error.response) {
        return networkErrorHandler(error)
    }

    switch (error.response.status) {
        case 400: return badRequestErrorHandler(error)
        default: return defaultRequestErrorHandler(error)
    }
};

export default getAlertFromError;