const SET_ERRORS = 'errors/SET_ERRORS';
const CLEAR_ERRORS = 'errors/CLEAR_ERRORS';

export const setErrors = (errors) => ({
    type: SET_ERRORS,
    payload: errors
})

export const clearErrors = () => ({
    type: CLEAR_ERRORS
})

const initialState = [];
export default function reducer(state = initialState, action) {
    const newState = [...state];
    switch(action.type) {
        case SET_ERRORS:
            return [...newState, ...action.payload];
        case CLEAR_ERRORS:
            return [];
        default:
            return newState
    }
}
