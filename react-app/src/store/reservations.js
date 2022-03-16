import { postTags } from "../components/establishment/utils";
import { setErrors } from "./errors";

const SET_RESERVATIONS = 'selectedDateAvailability/SET_RESERVATIONS'
const SET_RES = 'selectedDateAvailability/SET_RES';
const UPDATE_RES = 'selectedDateAvailability/UPDATE_RES';
const REMOVE_TAG = 'selectedDateAvailability/REMOVE_TAG';

const setReservations = (reservations) => ({
    type: SET_RESERVATIONS,
    payload: reservations
})

const setRes = (reservation) => ({
    type: SET_RES,
    payload: reservation
})

const setUpdatedRes = (reservation) => ({
    type: UPDATE_RES,
    payload: reservation
})

const setRemoveTag = (resId, tagId) => ({
    type: REMOVE_TAG,
    payload: {resId, tagId}
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
    if (response.ok) {
        dispatch(setReservations(data))
        return
    }
};

// NEW RESERVATION
export const newReservation = (reservationDetails) => async (dispatch) => {
    reservationDetails.reservation_time = reservationDetails.reservation_time.toISO()
    console.log('NEW RES ISO FROM THUNK: ', reservationDetails.reservation_time)

    if (!reservationDetails.section_id) {
        delete reservationDetails.section_id
    }
    console.log('RESERVATION DETAILS: ', !reservationDetails.section_id)
    if (!reservationDetails.table_id) {
        delete reservationDetails.table_id
    }
    console.log('RESERVATION DETAILS: ', reservationDetails)
    const response = await fetch('/api/reservations/new', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(reservationDetails)
        });
        const data = await response.json()
        if (!response.ok) {
            dispatch(setErrors(data.errors))
            return data
        }
        dispatch(setRes(data))
        return data
    }



// UPDATE RESERVATION
export const updateReservation = (reservationDetails) => async (dispatch) => {
    reservationDetails.reservation_time = reservationDetails.reservation_time.toISO()
    if (!reservationDetails.section_id) {
        delete reservationDetails.section_id
    }
    if (!reservationDetails.table_id) {
        delete reservationDetails.table_id
    }
    console.log('RESERVATION DETAILS: ', reservationDetails)
    const response = await fetch('/api/reservations/update', {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reservationDetails)
    })
    const data = await response.json()

    if (!response.ok) {
        dispatch(setErrors(data.errors))
        return data
    }
        dispatch(setUpdatedRes(data))
        // if (tags) {
        //     const tagAppliedData = await postTags(data.reservation.id, tags);
        //     if (tagAppliedData.result) {
        //         dispatch(setUpdatedRes(tagAppliedData.reservation));
        //         return tagAppliedData;
        //     }
        //     const returnErrors= { errors: [...tagAppliedData.errors, 'reservation successfully posted, but there was an error with your tags, please exit and edit reservation to attempt to add tags again']}
        //     return returnErrors;

        // }
    return data;
}
    // UPDATE STATUS
    export const updateAndSetResStatus = (reservationId, newStatusId) => async (dispatch) => {
        const response = await fetch('/api/reservations/status/update', {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"reservation_id": reservationId, "status_id": newStatusId})
        })
        const data = await response.json();
        if (response.ok) {
            dispatch(setUpdatedRes(data.reservation))
        }
        return data;
    }

    //REMOVE TAG
export const removeTag = (reservationId, tagId) => async (dispatch) => {
    // console.log('MADE IT INTO TAG STORE: ', reservationId, tagId)
    const response = await fetch(`/api/tags/${reservationId}/${tagId}/remove`, {method:"DELETE"})
    const data = await response.json()
    if (response.ok) {
        dispatch(setRemoveTag(reservationId, tagId))
        return data;
    }
    return data;
}

const initialState = {};
export default function reducer(state = initialState, action) {
    const newState = {...state};
    switch(action.type) {
        case SET_RESERVATIONS:
            return action.payload
        case SET_RES:
            newState[action.payload.id] = action.payload
            return newState
        case UPDATE_RES:
            newState[action.payload.id] = action.payload
            return newState
        case REMOVE_TAG:
            const tagToRemoveIndex = newState.action.payload.resId.tags.findIndex((tag) => tag.id === action.payload.tagId)
            newState.resId.tags.splice(tagToRemoveIndex, 1)
            const updatedRes = {...newState.resId, tags: [...newState.resId.tags]}
            newState.resId = updatedRes
            return newState
        default:
            return state;
    }
}
