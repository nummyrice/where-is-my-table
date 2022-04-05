import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import style from "./auth.module.css";

const EstablishmentSetup = () => {
    const user = useSelector(state => state.session.user)
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

    const handleSubmit = (event) => {
        event.preventDefault()
        const newEstablishment = {
            user_id: user.id,
            name: establishmentName,
            timezone_id: selectedTZ,
            daylight_savings: daylightSavings
        }
        console.log('submit test', newEstablishment)
        fetch("api/establishments/new", {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(newEstablishment)
        }).then(async res => {
            const data = await res.json()
            if (res.ok) return;
            return setErrors(data.errors)
        })
    }

    return(
        <div id={style.est_setup_background}>
            <h2 id={style.est_form_title}>{"Register Your Restaurant"}</h2>
            <form id={style.est_setup_form}>
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
                <button id={style.est_submit_button} onClick={handleSubmit} type={"submit"}>{"Register Business"}</button>

            </form>
        </div>
    )
}

export default EstablishmentSetup;
