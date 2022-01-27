const SET_WAITLIST = 'selectedDateWaitlist/SET_WAITLIST';
const SET_PARTY = 'selectedDateWaitlist/SET_PARTY';
const UPDATE_PARTY = 'selectedDateWaitlist/UPDATE_PARTY';
const DELETE_PARTY = 'selectedDateWaitlist/DELETE_PARTY'

const setWaitlist = (waitlist) => ({
    type: SET_WAITLIST,
    payload: waitlist
})

const setParty = (party) => ({
    type: SET_PARTY,
    payload: party
})

const updateParty = (party) => ({
    type: UPDATE_PARTY,
    payload: party
})

const deleteParty = (partyId) => ({
    type: DELETE_PARTY,
    payload: partyId
})

// GET WAITLIST
export const getSelectedDateWaitlist = (selectedDateISOstring) => async (dispatch) => {
    const response = await fetch('/api/waitlist/selected-date', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"selected_date": selectedDateISOstring})
    });
    const data = await response.json()
    if (response.ok) {
        dispatch(setWaitlist(data.waitlist))
    }
    return data;
}

// NEW WAITLIST PARTY
export const newWaitlistParty = (guestId, partySize, estimatedWait, tags) => async (dispatch) => {
    const newParty = {
        guest_id: guestId,
        party_size: partySize,
        estimated_wait: estimatedWait
    }
    const response = await fetch('/api/waitlist/new', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newParty)
    })
    const data = await response.json()
    console.log('THIS MY PARTY: ', data)
    if (response.ok) dispatch(setParty(data.party));
    return data;
}

//UPDATE WAITLIST PARTY
export const updateWaitlistParty = (waitlistId, guestId, partySize, estimatedWait, tags) => async (dispatch) => {
    const updatedParty = {
        id: waitlistId,
        guest_id: guestId,
        party_size: partySize,
        estimated_wait: estimatedWait,
    }
    const response = await fetch('/api/waitlist/update', {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatedParty)
    })
    const data = await response.json();
    if (response.ok) dispatch(updateParty(data.party));
    return data;
}

// UPDATE STATUS
export const updateAndSetPartyStatus = (partyId, newStatusId) => async (dispatch) => {
    const response = await fetch('/api/waitlist/status/update', {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"party_id": partyId, "status_id": newStatusId})
    })
    const data = await response.json();
    if (response.ok) {
        dispatch(updateParty(data.party))
    }
    return data;
}

// DELETE PARTY
export const deleteAndUnsetParty = (partyId) => async (dispatch) => {
    const response = await fetch(`api/waitlist/${partyId}remove`, {method: 'DELETE'});
    const data = await response.json();
    if (response.ok) {
        dispatch(deleteParty(partyId))
    }
    return data;
}

const initialState = [];
export default function reducer(state = initialState, action) {
    const newState = [...state];
    switch(action.type) {
        case SET_WAITLIST:
            return action.payload
        case SET_PARTY:
            console.log("WE'VE MADE IT TO SET PARTY", action.payload)
            newState.push(action.payload);
            return newState;
        case UPDATE_PARTY:
            const updatedPartyIndex = newState.findIndex((party) => party.id === action.payload.id)
            newState.splice(updatedPartyIndex, 1, action.payload)
            return newState;
        case DELETE_PARTY:
            const targetPartyIndex = newState.findIndex((party) => party.id === action.payload)
            newState.splice(targetPartyIndex, 1)
            return newState;
        default:
            return state;
    }
}
