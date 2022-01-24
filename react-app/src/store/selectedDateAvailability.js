const SET_SELECTED_DATE = 'selectedDateAvailability/SET_DATE';
const UPDATE_STATUS = 'selectedDateAvailability/UPDATE_STATUS';

const setSelectedDateAvailability = (selectedDateAvailability) => ({
    type: SET_SELECTED_DATE,
    payload: selectedDateAvailability
})

const setStatus = (reservation) => ({
    type: UPDATE_STATUS,
    payload: reservation
})

export const getSelectedDateAvailability = (currentTimestamp) => async (dispatch) => {
    const response = await fetch('/api/reservations/selected-date', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"selected_date": currentTimestamp})
    });
    const data = await response.json()
    dispatch(setSelectedDateAvailability(data.selectedDateAvailability));
    return data;
}

export const updateAndSetStatus = (reservationId, newStatusId) => async (dispatch) => {
    const response = await fetch('/api/reservations/status/update', {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"reservation_id": reservationId, "status_id": newStatusId})
    })

    const data = await response.json();

    if (response.ok) {
        dispatch(setStatus(data.reservation))
    }
    return data;
}

const initialState = {};
export default function reducer(state = initialState, action) {
    switch(action.type) {
        case SET_SELECTED_DATE:
            return action.payload
        case UPDATE_STATUS:
            const newReservations = [...state.reservations];
            const resIndex = newReservations.findIndex((reservation)=> reservation.id === action.payload.id);
            newReservations.splice(resIndex, 1, action.payload);
            const newState = {...state, reservations: newReservations};
            return newState;
        default:
            return state;
    }
}
