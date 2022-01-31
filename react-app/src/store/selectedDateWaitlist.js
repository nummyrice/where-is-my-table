import { postPartyTags } from '../components/establishment/utils.js';

const SET_WAITLIST = 'selectedDateWaitlist/SET_WAITLIST';
const SET_PARTY = 'selectedDateWaitlist/SET_PARTY';
const UPDATE_PARTY = 'selectedDateWaitlist/UPDATE_PARTY';
const DELETE_PARTY = 'selectedDateWaitlist/DELETE_PARTY';
const REMOVE_TAG = 'selectedDateWaitlis/REMOVE_TAGt';

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

const setRemoveTag = (waitlistId, tagId) => ({
    type: REMOVE_TAG,
    payload: {waitlistId, tagId}
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
    if (response.ok) {
        dispatch(setParty(data.party));
        if (tags) {
            const tagAppliedData = await postPartyTags(data.party.id, tags)
            if (tagAppliedData.result) {
                dispatch(updateParty(tagAppliedData.party))
                return tagAppliedData;
            }
            const returnErrors= { errors: [...tagAppliedData.errors, 'party successfully posted, but there was an error with your tags, please exit and edit reservation to attempt to add tags again']}
            return returnErrors
        }
        return data;
    }
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
    console.log('UPDATE WAITLIST PARTY: ', updatedParty)
    const response = await fetch('/api/waitlist/update', {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatedParty)
    })
    const data = await response.json();
    if (response.ok) {
        dispatch(updateParty(data.party))
        if (tags) {
            const tagAppliedData = await postPartyTags(data.party.id, tags);
            if (tagAppliedData.result) {
                dispatch(updateParty(tagAppliedData.party))
                return tagAppliedData;
            }
            const returnErrors= { errors: [...tagAppliedData.errors, 'party successfully posted, but there was an error with your tags, please exit and edit reservation to attempt to add tags again']}
            return returnErrors
        }
        return data;
    };
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
        return data;
    }
    return data;
}

//RENMOVE TAG
export const removePartyTag = (waitlistId, tagId) => async (dispatch) => {
    const response = await fetch(`/api/tags/${waitlistId}/${tagId}/remove`, {method:"DELETE"})
    const data = await response.json()
    if (response.ok) {
        dispatch(setRemoveTag(waitlistId, tagId))
        return data;
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

//TODO: must update availability if reservation is added or updated (or cancel status is updated)

const initialState = [];
export default function reducer(state = initialState, action) {
    const newState = [...state];
    switch(action.type) {
        case SET_WAITLIST:
            return action.payload
        case SET_PARTY:
            // console.log("WE'VE MADE IT TO SET PARTY", action.payload)
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
        case REMOVE_TAG:
            const partyIndex = newState.findIndex((party)=> party.id === action.payload.waitlistId);
            const tagToRemoveIndex = newState[partyIndex].tags.findIndex((tag)=> tag.id === action.payload.tagId)
            newState[partyIndex].tags.splice(tagToRemoveIndex, 1)
            const newTags = [...newState[partyIndex].tags]
            const newParty = {...newState[partyIndex], tags: newTags}
            newState.splice(partyIndex, 1, newParty)
            return newState;
        default:
            return state;
    }
}
