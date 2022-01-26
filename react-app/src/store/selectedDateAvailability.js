import { postTags } from "../components/establishment/utils";


const SET_SELECTED_DATE = 'selectedDateAvailability/SET_DATE';
const SET_RES = 'selectedDateAvailability/SET_RES';
const UPDATE_RES = 'selectedDateAvailability/UPDATE_RES';

const setSelectedDateAvailability = (selectedDateAvailability) => ({
    type: SET_SELECTED_DATE,
    payload: selectedDateAvailability
})

const setRes = (reservation) => ({
    type: SET_RES,
    payload: reservation
})

const setUpdatedRes = (reservation) => ({
    type: UPDATE_RES,
    payload: reservation
})

// GET AVAILABLE TABLES AND CURR. RESERVATIONS
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

// NEW RESERVATION
export const newReservation = (guestId, reservationTime, partySize, tableId, tags) => async (dispatch) => {
    const newReservation = {
        guest_id: guestId,
        reservation_time: reservationTime,
        party_size: partySize,
        table_id: tableId
    };
    const response = await fetch('/api/reservations/new', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newReservation)
    });
    const data = await response.json();
    if (response.ok) {
        if (tags) {
            const tagAppliedData = postTags(data.reservation.id, tags);
            dispatch(setUpdatedRes(tagAppliedData.reservation));
            return tagAppliedData;
        }
        dispatch(setRes(data.newReservation));
        return data;
    }
    return data;
}

// UPDATE RESERVATION
export const updateReservation = (reservationId, guestId, reservationTime, partySize, tableId, tags) => async (dispatch) => {
    const resToUpdate = {
        reservation_id: reservationId,
        guest_id: guestId,
        reservation_time: reservationTime,
        party_size: partySize,
        table_id: tableId
    }
    const response = await fetch('/api/reservations/update', {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(resToUpdate)
    })
    const data = await response.json()

    if (response.ok) {
        if (tags) {
            const tagAppliedData = postTags(data.reservation.id, tags);
            dispatch(setRes(tagAppliedData.reservation));
            return tagAppliedData;
        }
        dispatch(setUpdatedRes(data.reservation))
        return data;
    }
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

const initialState = {availability:[], reservations:[]};
export default function reducer(state = initialState, action) {
    const newState = {...state};
    switch(action.type) {
        case SET_SELECTED_DATE:
            return action.payload
        case SET_RES:
            return {...state, reservations: [...state.reservations, action.payload]};
        case UPDATE_RES:
            if (newState.reservations.length) {
                const newStatusReservation = [...state.reservations];
                console.log('REDUCER LOG', newStatusReservation)
                const resIndex = newStatusReservation.findIndex((reservation)=> {
                    console.log(action.payload)
                    return reservation.id === action.payload.id});
                newStatusReservation.splice(resIndex, 1, action.payload);
                return {...newState, reservations: newStatusReservation};
            }
            return newState;
        default:
            return state;
    }
}
