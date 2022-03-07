const SET_RESERVATIONS = 'selectedDateAvailability/SET_RESERVATIONS'

const setReservations = (reservations) => ({
    type: SET_RESERVATIONS,
    payload: reservations
})

// GET RESERVATIONS FOR SELECTED DATE
export const getReservations = (selectedDate) => async (dispatch) => {
    const response = await fetch('/api/reservations/selected-date', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"selected_date": selectedDate})
    });
    const data = await response.json()
    console.log('RESERVATIONS: ', data)
    if (response.ok) {
        dispatch(setReservations(data))
        return
    }
};

const initialState = {};
export default function reducer(state = initialState, action) {
    const newState = {...state};
    switch(action.type) {
        case SET_RESERVATIONS:
            return action.payload
        default:
            return state;
    }
}
