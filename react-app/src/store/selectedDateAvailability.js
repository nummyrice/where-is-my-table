const SET_SELECTED_DATE = 'selectedDateAvailability/SET_DATE';

const setSelectedDateAvailability = (selectedDateAvailability) => ({
    type: SET_SELECTED_DATE,
    payload: selectedDateAvailability
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

const initialState = {};
export default function reducer(state = initialState, action) {
    switch(action.type) {
        case SET_SELECTED_DATE:
            return action.payload
        default:
            return state;
    }
}
