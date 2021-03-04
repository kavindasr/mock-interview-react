import { addItemToArray, removeItemFromArray, updateObject, INDEX } from '../../shared/utility'
import * as actionTypes from '../actions/actionTypes'

const initialState = {
    alerts: []
};

const addAlert = (state, action) => {
    let alertState = {
        alerts: addItemToArray(
            state.alerts,
            action.alert
        )
    }

    return updateObject(
        state,
        alertState
    );
};

const removeAlert = (state, action) => {
    let alertState = {
        alerts: removeItemFromArray(
            state.alerts,
            INDEX,
            action.alertId
        )
    }

    return updateObject(
        state,
        alertState
    );
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_ALERT: return addAlert(state, action);
        case actionTypes.REMOVE_ALERT: return removeAlert(state, action);
        default: return state;
    }
}

export default reducer;