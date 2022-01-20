const SET_SEVEN_DAY_AVAILABILITY = 'availability/SET_SEVEN_DAY_AVAILABILITY';

const setSevenDayAvailability = (availability) => ({
    type: SET_SEVEN_DAY_AVAILABILITY,
    payload: availability
});

// GET AVAILABLE TABLES
export const getSevenDayAvailability = (client_date) => async (dispatch) => {
    const response = await fetch('/api/reservations/seven-day', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"client_date": client_date.toISOString()}),
    });
    const data = await response.json()
    dispatch(setSevenDayAvailability(data.sevenDayAvailability));
    return data;
}

const initialState = [];
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_SEVEN_DAY_AVAILABILITY:
            return action.payload
    default:
        return state;
    }
}
