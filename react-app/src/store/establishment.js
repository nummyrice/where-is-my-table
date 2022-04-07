import { setErrors } from "./errors"
const SET_ESTABLISHMENT = 'establishment/SET_ESTABLISHMENT'
const SET_SECTION = 'establishment/SET_SECTION'
const UPDATE_SECTION = 'establishment/UPDATE_SECTION'
const DELETE_SECTION = 'establishment/DELETE_SECTION'
const UNSET_ESTABLISHMENT = 'establishment/UNSET_ESTABLISHMENT'

const setEstablishment = (establishment) => ({
    type: SET_ESTABLISHMENT,
    payload: establishment
})

const updateSection = (section) => ({
    type: UPDATE_SECTION,
    payload: section
})

const deleteSection = (sectionId) => ({
    type: DELETE_SECTION,
    payload: sectionId
}
)
export const unsetEstablishment = () => ({
    type: UNSET_ESTABLISHMENT
})

export const getEstablishment = (establishmentId) => async (dispatch) => {
    const response = await fetch(`api/establishments/${establishmentId}`)
    const data = await response.json();
    if (!response.ok) {
        // setErrors(data.errors)
        return data;
    }
    dispatch(setEstablishment(data))
}

export const newEstablishement = (userId, name, timezoneId, daylightSavings) => async (dispatch) => {
    const newEstablishment = {
        user_id: userId,
        name: name,
        timezone_id: timezoneId,
        daylight_savings: daylightSavings
    }
    const response = await fetch("api/establishments/new", {
                                method: "POST",
                                headers: {'Content-Type': "application/json"},
                                body: JSON.stringify(newEstablishment)
                            })
    const data = await response.json()
    if (!response.ok) {
        dispatch(setErrors(data.errors))
    }
    dispatch(setEstablishment(data))
    return data;

}

const initialState = null;
export default function reducer(state = initialState, action) {
    const newState = !state ? {} : {...state}
    switch(action.type) {
        case SET_ESTABLISHMENT:
            return action.payload
        case UNSET_ESTABLISHMENT:
            return {}
        case SET_SECTION:
            newState.sections = {...newState.sections, [action.payload.id]: action.payload}
            return newState
        case UPDATE_SECTION:
            newState.sections = {...newState.sections, [action.payload.id]:{...action.payload}}
            return newState
        case DELETE_SECTION:
            const newSectionState = {...newState.sections}
            delete newSectionState[action.payload]
            newState.sections = newSectionState
            return newState
        default:
            return state;
    }
}
