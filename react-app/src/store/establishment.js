const SET_ESTABLISHMENT = 'establishment/SET_ESTABLISHMENT'
const SET_SECTION = 'establishment/SET_SECTION'
const UPDATE_SECTION = 'establishment/UPDATE_SECTION'
const DELETE_SECTION = 'establishment/DELETE_SECTION'
const UNSET_ESTABLISHMENT = 'establishment/UNSET_ESTABLISHMENT'

const setEstablishment = (establishment) => ({
    type: SET_ESTABLISHMENT,
    payload: establishment
})

const update_section = (section) => ({
    type: UPDATE_SECTION,
    payload: section
})

const delete_section = (sectionId) => ({
    type: DELETE_SECTION,
    payload: sectionId
}
)
const unsetEstablishment = () => ({
    type: UNSET_ESTABLISHMENT
})

const initialState = {};
export default function reducer(state = initialState, action) {
    const newState = {...state};
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
