import { setErrors } from "./errors"
const SET_ESTABLISHMENT = 'establishment/SET_ESTABLISHMENT'
const SET_SECTION = 'establishment/SET_SECTION'
const UPDATE_SECTION = 'establishment/UPDATE_SECTION'
const DELETE_SECTION = 'establishment/DELETE_SECTION'
const UNSET_ESTABLISHMENT = 'establishment/UNSET_ESTABLISHMENT'
const UPDATE_ESTABLSHMENT = 'establishment/UPDATE_ESTABLISHMENT'
const NEW_TABLE = 'establishment/NEW_TABLE'
const UPDATE_TABLE = 'establishment/UPDATE_TABLE'
const DELETE_TABLE = 'establishment/DELETE_TABLE'

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

const setTable = (table) => ({
    type: NEW_TABLE,
    payload: table
})

const updateTable = (table) => ({
    type: UPDATE_TABLE,
    payload: table
})

const unsetTable = (tableId, sectionId) => ({
    type: DELETE_TABLE,
    payload: {sectionId, tableId}
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
        return data;
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
    console.log("update estab: ", updatedEstablishment)
    const response = await fetch("/api/establishments/edit", {
                                method: "PUT",
                                headers: {'Content-Type': "application/json"},
                                body: JSON.stringify(updatedEstablishment)
                            })
    const data = await response.json()
    if (!response.ok) {
        dispatch(setErrors(data.errors))
        return data
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

export const createTable = (newTableDetails) => async (dispatch) => {
    const response = await fetch(`/api/establishments/tables/new`, {
        method: "POST",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify(newTableDetails)})
    const data = await response.json()
    if (!response.ok) {
        if (data.errors) dispatch(setErrors)
        return data;
    }
    dispatch(setTable(data))
    return data;
}

export const modifyTable = (updatedTableDetails) => async (dispatch) => {
    const response = await fetch(`/api/establishments/tables/edit`, {
        method: "PUT",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify(updatedTableDetails) })
    const data = await response.json()
    if (!response.ok) {
        if (data.errors) dispatch(setErrors)
        return data;
    }
    dispatch(updateTable(data))
    return data;
}

export const deleteTable = (tableId, sectionId) => async (dispatch) => {
    const response = await fetch(`/api/establishments/tables/${tableId}`, {method: "DELETE"})
    const data = await response.json()
    if (!response.ok) {
        if (data.errors) dispatch(setErrors)
        return data;
    }
    dispatch(unsetTable(tableId, sectionId))
    return data;
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
            return null;
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
        case NEW_TABLE:
            const tableSection = newState.sections[action.payload.section.id]
            const tables = {...tableSection.tables, [action.payload.id]: action.payload}
            return {...newState, sections: {...newState.sections, [action.payload.section.id]: {...tableSection, tables: tables}}}
        case UPDATE_TABLE:
            const tableSectionToUpdate = newState.sections[action.payload.section.id]
            const tablesToUpdate = {...tableSectionToUpdate.tables, [action.payload.id]: action.payload}
            for (let sectionId in newState.sections) {
                if (sectionId !== action.payload.section.id) {
                    if (newState.sections[sectionId].tables[action.payload.id]) {
                        delete newState.sections[sectionId].tables[action.payload.id]
                    }
                }
            }
            return {...newState, sections: {...newState.sections, [action.payload.sectionId]: {...tableSectionToUpdate, tables: tablesToUpdate}}}
        case DELETE_TABLE:
            const deleteFromSection = newState.sections[action.payload.sectionId]
            const deleteFromTables = {...deleteFromSection.tables, [action.payload.tableId]: action.payload}
            delete deleteFromTables[action.payload.tableId]
            return {...newState, sections: {...newState.sections, [action.payload.sectionId]: {...deleteFromSection, tables: deleteFromTables}}}
        default:
            return state;
    }
}
