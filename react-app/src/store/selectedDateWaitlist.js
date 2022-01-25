const SET_WAITLIST = 'selectedDateWaitlist/SET_WAITLIST';

const setWaitlist = (waitlist) => ({
    type: SET_WAITLIST,
    payload: waitlist
})

export const getSelectedDateWaitlist = (selectedDateISOstring) => async (dispatch) => {
    const response = await fetch('/api/waitlist/selected-date', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"selected_date": selectedDateISOstring})
    });
    const data = await response.json()

    console.log('DATA FROM WAITLIST DISPATCH: ', data)
    if (response.ok) {
        dispatch(setWaitlist(data.waitlist))
    }
    return data;
}

const initialState = [];
export default function reducer(state = initialState, action) {
    switch(action.type) {
        case SET_WAITLIST:
            return action.payload
        default:
            return state;
    }
}
