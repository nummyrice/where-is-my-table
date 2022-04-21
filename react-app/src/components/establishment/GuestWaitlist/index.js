import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import style from './GuestWaitlist.module.css'
import { ReactComponent as UserProfile} from '../ResSchedule/assets/user-solid.svg'
import { newWaitlistParty } from '../../../store/selectedDateWaitlist';
import { login } from '../../../store/session';

const GuestWaitlist = () => {
    const { establishmentName, id} = useParams()
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    console.log(user, "user here")
    const initialWaitlistData = {
        "waitlist_count": 0,
        "estimated_wait": 5,
        "place": null,
        "waitlist": [{
            "estimated_wait": 15,
            "guest": "kyle",
            "guest_id": 10,
            'created_at': "2022-04-05 03:33:29.240002-07",
        }]
    }
    const [waitlistData, setWaitlistData] = useState(initialWaitlistData)
    const [partySize, setPartySize] = useState(1)
    useLayoutEffect(() => {
        fetch(`/api/waitlist/${establishmentName}/${id}/waitlist-details`)
            .then(async res => {
                const data = await res.json()
                if (!res.ok) return data
                setWaitlistData(data)
            })
    }, [])

    const handlePartySubmit = async () => {
        // const loginData = await dispatch(login("establishment_demo@aa.io", "password1"))
        const newParty = {
            guest_id: user.id,
            party_size: partySize,
            estimated_wait: waitlistData.estimated_wait,
            establishment_id: id
        }

        const response = await fetch('/api/waitlist/new/guest-access', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newParty)
        })
        const data = await response.json()
        if (!response.ok) return console.log(data.errors)
        if (response.ok) alert("successfully added to waitlist")
    }

    const loginRedirect = () => {
        history.push("/login")
    }

    const signupRedirect = () => {
        history.push("/sign-up")
    }

    const partySizeOptions = Array(21).fill(0).map((ele, i) => i+1 )
    return(
        <>
            <div id={style.box} className={style.gradient_border}>
            <div id={style.paper_list}>
                <p id={style.current_waitlist}>{"Current Waitlist"}</p>
                <div id={style.scroll_box}>
                    {waitlistData.waitlist.map(party => {
                        return(
                            <div className={style.party_entry}>
                                <div className={style.user_icon_wrapper}><UserProfile/></div>
                                {(!user || (user && party.guest_id !== user.id)) && <div>{`${party.guest.split('')[0]} ${'*'.repeat(party.guest.length)}`}</div>}
                                {user && party.guest_id === user.id && <div>{`${party.guest}`}</div>}
                            </div>
                        )
                    })
                    }
                    {!waitlistData.waitlist.length && <p>{"It looks like you are next"}</p>}
                </div>
            </div>
                <h1>{`Join ${establishmentName}'s Waitlist`}</h1>
                <p className={style.current_waitlist_details}>{`Estimated wait: ${waitlistData.estimated_wait} minutes`}</p>
                <p className={style.current_waitlist_details}>{`There are ${waitlistData.waitlist_count} guests ahead of you.`}</p>
                <form id={style.new_party_form}>
                    <label>{"Party Name:"}</label>
                    <div>{user ? user.name : "please login or sign up"}</div>
                    <label id={style.party_size_label}>{"How many guests in your Party"}</label>
                    <select value={partySize} onChange={e => setPartySize(e.target.value)}>
                        {partySizeOptions.map(guestNum => {
                            return(
                                <option value={guestNum}>{guestNum === 1 ? " 1 Guest" : guestNum + " Guests" }</option>
                            )
                        })}
                    </select>
                </form>
                <div id={style.btn_section}>
                {user && <button onClick={handlePartySubmit} className={`${style.custom_btn} ${style.btn_9}`}>Join Waitlist</button>}
                {!user && id === 1 && <button onClick={handlePartySubmit} className={`${style.custom_btn} ${style.btn_9}`}>Join Waitlist</button>}
                {!user && id !== 1 &&
                    <>
                    <button onClick={loginRedirect} className={`${style.custom_btn} ${style.btn_9}`}>Login</button>
                    <button onClick={signupRedirect} className={`${style.custom_btn} ${style.btn_9}`}>Sign Up</button>
                    </>
                }
                </div>
            </div>
        </>
    )
}

export default GuestWaitlist
