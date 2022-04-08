import { setErrors } from "./errors"
const SET_ESTABLISHMENT = 'establishment/SET_ESTABLISHMENT'
const SET_SECTION = 'establishment/SET_SECTION'
const UPDATE_SECTION = 'establishment/UPDATE_SECTION'
const DELETE_SECTION = 'establishment/DELETE_SECTION'
const UNSET_ESTABLISHMENT = 'establishment/UNSET_ESTABLISHMENT'
const UPDATE_ESTABLSHMENT = 'establishment/UPDATE_ESTABLISHMENT'

const setEstablishment = (establishment) => ({
    type: SET_ESTABLISHMENT,
    payload: establishment
})

const setSection = (section) => ({
    type: SET_SECTION,
    payload: section
})

const updateSection = (section) => ({
    type: UPDATE_SECTION,
    payload: section
})

const unsetSection = (sectionId) => ({
    type: DELETE_SECTION,
    payload: sectionId
}
)
export const unsetEstablishment = () => ({
    type: UNSET_ESTABLISHMENT
})

const updateEstablishment = (establishment) => ({
    type: UPDATE_ESTABLSHMENT,
    payload: establishment
})

export const getEstablishment = (establishmentId) => async (dispatch) => {
    const response = await fetch(`/api/establishments/${establishmentId}`)
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
    const response = await fetch("/api/establishments/new", {
                                method: "POST",
                                headers: {'Content-Type': "application/json"},
                                body: JSON.stringify(newEstablishment)
                            })
    const data = await response.json()
    if (!response.ok) {
        dispatch(setErrors(data.errors))
        return
    }
    dispatch(setEstablishment(data))
    return data;
}

export const editEstablishment = (id, name, daylightSavings) => async (dispatch) => {
    const updatedEstablishment = {
        id: id,
        name: name,
        daylight_savings: daylightSavings
    }
    const response = await fetch("/api/establishments/edit", {
                                method: "PUT",
                                headers: {'Content-Type': "application/json"},
                                body: JSON.stringify(updatedEstablishment)
                            })
    const data = await response.json()
    if (!response.ok) {
        dispatch(setErrors(data.errors))
        return
    }
    dispatch(updateEstablishment(data))
    return data;
}

export const newSection = (sectionName, sectionSchedule, establishmentId) => async (dispatch) => {
    const newSection = {
        establishment_id: establishmentId,
        name: sectionName,
        schedule: sectionSchedule
    }
    console.log("new section thunk: ", newSection)
    const response = await fetch("/api/establishments/sections/new", {
        method: "POST",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify(newSection)
    })
    const data = await response.json()
    if (!response.ok) {
        if (data.errors) dispatch(setErrors(data.errors))
        return data
    }
    dispatch(setSection(data))
    return data;
}

export const editSection = (sectionId, sectionName, sectionSchedule) => async (dispatch) => {
    const updatedSection = {
        id: sectionId,
        name: sectionName,
        schedule: sectionSchedule
    }

    const response = await fetch("/api/establishments/sections/edit", {
        method: "PUT",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify(updatedSection)
    })
    const data = await response.json()
    if (!response.ok) {
        if (data.errors) dispatch(setErrors(data.errors))
        return data
    }
    dispatch(updateSection(data))
    return data;
}

export const deleteSection = (sectionId) => async (dispatch) => {
    const response = await fetch(`/api/establishments/sections/${sectionId}`, {method: "DELETE"})
    if (response.ok) {
        dispatch(unsetSection(sectionId))
    }
}

const initialState = null;
export default function reducer(state = initialState, action) {
    const newState = !state ? {} : {...state}
    switch(action.type) {
        case SET_ESTABLISHMENT:
            return action.payload
        case UPDATE_ESTABLSHMENT:
            newState.name = action.payload.name
            newState.daylight_savings = action.payload.daylightSavings
            return newState
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
