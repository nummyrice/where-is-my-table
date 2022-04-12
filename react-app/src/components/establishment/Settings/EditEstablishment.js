import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import style from './Settings.module.css'
import { editEstablishment } from '../../../store/establishment';
import { setErrors } from '../../../store/errors';

const EditEstablishment = ({establishment, setShowErrorsModal}) => {
    const dispatch = useDispatch()
    // const history = useHistory()
    const [establishmentName, setEstablishmentName] = useState(establishment.name)
    const [daylightSavings, setDaylightSavings] = useState(establishment.daylight_savings)

    const handleSubmit = (event) => {
        event.preventDefault()
        dispatch(editEstablishment(establishment.id, establishmentName, daylightSavings))
            .then(async data => {
            if (data.errors) {
                setErrors(data.errors)
                setShowErrorsModal(true)
                return
            }
            alert("Successfully Updated Establishment")
        })
    }
    return(
        <form id={style.edit_est_form}>
           <label htmlFor={"name"}>{"Name of Establishment"}</label>
            <input placeholder={'must be 5 to 40 characters'} minLength={"5"} maxLength={"40"} onChange={e => setEstablishmentName(e.target.value)} type={"text"} name={"name"} value={establishmentName}></input>
            <label htmlFor={"timezones"}>{"Timezone"}<span id={style.timezone_details}>{"timezone may not be changed once establihsment is created"}</span></label>
            <input readOnly={true} name={"timezones"} value={establishment.timezone.name}></input>
            <label htmlFor={"daylight_savings"}>{"Daylight Savings"}</label>
            <input  onChange={e => setDaylightSavings(!daylightSavings)} type={"checkbox"} name={"daylight_savings"} value={daylightSavings}></input>
            <button id={style.est_submit_button} onClick={handleSubmit} type={"submit"}>{"Update Details"}</button>
        </form>
    )
}

export default EditEstablishment
