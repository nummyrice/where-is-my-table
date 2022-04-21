import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import style from "./auth.module.css";
import { newEstablishement } from '../../store/establishment';

const EstablishmentSetup = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const establishment = useSelector(state => state.establishment)
    const [timezones, setTimezones] = useState([])
    const [selectedTZ, setSelectedTZ] = useState(1)
    const [establishmentName, setEstablishmentName] = useState('')
    const [daylightSavings, setDaylightSavings] = useState(false)
    const [errors, setErrors] = useState([])
    useEffect(() => {
        fetch("/api/establishments/timezones")
        .then( async res => {
            const data = await res.json()
            if (res.ok)  setTimezones(data.timezones)
            // if (res.ok)  data.timezones.forEach(tz => timezones.current.push(tz))
        })
    }, [])
    if (establishment) return(<Redirect to={'/establishment'}/>)

    const handleSubmit = (event) => {
        event.preventDefault()
        dispatch(newEstablishement(user.id, establishmentName, selectedTZ, daylightSavings))
            .then(async data => {
            if (data.errors) return setErrors(data.errors);
            history.push('/establishment/sections')
        })
    }
    return(
        <div id={style.est_setup_background}>
            <h2 id={style.est_form_title}>{"Register Your Restaurant"}</h2>
            <form className={style.gradient_border} id={style.est_setup_form}>
                {errors.map(e => (
                    <div key={e} className={style.error}>{e}</div>
                ))}
                <label htmlFor={"name"}>{"Name of Establishment"}</label>
                <input placeholder={'must be 5 to 40 characters'} minLength={"5"} maxLength={"40"} onChange={e => setEstablishmentName(e.target.value)} type={"text"} name={"name"} value={establishmentName}></input>
                <label htmlFor={"timezones"}>{"Timezone"}<span id={style.timezone_details}>{"timezone may not be changed once establihsment is created"}</span></label>
                <select onChange={e=>setSelectedTZ(e.target.value)} name={"timezones"} value={selectedTZ}>
                    {timezones.map(tz => (
                        <option key={tz.id} value={tz.id}>{tz.name}</option>
                    ))}
                </select>
                <label htmlFor={"daylight_savings"}>{"Daylight Savings"}</label>
                <input  onChange={e => setDaylightSavings(!daylightSavings)} type={"checkbox"} name={"daylight_savings"} value={daylightSavings}></input>
                <h3 id={style.est_user_confirm}>{"Current User: "}<span>{user.name}</span></h3>
                <p>{"Is this the correct user account to register your business to? The user account associated with your business cannot be changed once registeration is complete."}</p>
                <button id={style.est_submit_button} className={`${style.custom_btn} ${style.btn_9}`} onClick={handleSubmit} type={"submit"}>{"Register Business"}</button>

            </form>
        </div>
    )
}

export default EstablishmentSetup;
