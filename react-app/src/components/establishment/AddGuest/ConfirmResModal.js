import React, { useState, useContext } from 'react';
import { EstablishmentContext } from '..';
import { useDispatch } from 'react-redux';
import { newGuestFetch, updateGuestFetch } from '../utils';
import { newReservation, updateReservation } from '../../../store/selectedDateAvailability';
import style from './AddGuest.module.css';

const ConfirmResModal = ({errors, name, editReservation, setEditReservation, setShowMakeRes, setShowConfirmRes, date, table, partySize, notes, phoneNumber, email, tags, editNameField, editEmailField, editNumberField, editNotesField, selectedGuest}) => {
    const dispatch = useDispatch();
    const [serverErrors, setServerErrors] = useState(errors);
        const {setSelectedDate, selectedDate} = useContext(EstablishmentContext)


    // UPDATE RESERVATION
    const handleResUpdate = async () => {
            // if guest is selected but none of the edits are present
            if (selectedGuest && !editEmailField && !editNameField && !editNumberField && !editNotesField) {
                dispatch(updateReservation(editReservation.id, selectedGuest.id, date, partySize, table, tags))
                    .then((data) => {
                        if (data.errors) {
                            setServerErrors(data.errors)
                            return data;
                        } else {
                            setShowConfirmRes(false)
                            setEditReservation(null)
                            const resDate = new Date(date);
                            resDate.setHours(0,0,0,0);
                            setSelectedDate(resDate)
                            return data;
                        }
                    })
            }
            // if guest is selected and any edit is present
            if (selectedGuest && (editEmailField || editNameField || editNumberField || editNotesField)) {
                const updatedGuestResult = await updateGuestFetch(selectedGuest.id, name, notes, phoneNumber, email)
                // if update is success
                if (updatedGuestResult.result) {
                    dispatch(updateReservation(editReservation.id, selectedGuest.id, date, partySize, table, tags))
                    .then((data) => {
                        if (data.errors) {
                            setServerErrors(data.errors)
                            return data;
                        } else {
                            setShowConfirmRes(false)
                            setEditReservation(null)
                            const resDate = new Date(date);
                            resDate.setHours(0,0,0,0);
                            setSelectedDate(resDate)
                            return data;
                        }
                    })
                }
                if (updatedGuestResult.errors) setServerErrors(updatedGuestResult.errors);
                return updatedGuestResult;
            }
            // if not guest is selected
            if (!selectedGuest) {
                const newGuestResult = await newGuestFetch(name, notes, phoneNumber, email);
                if (newGuestResult.result) {
                    dispatch(updateReservation(editReservation.id, newGuestResult.guest.id, date, partySize, table, tags))
                    .then((data) => {
                        if (data.errors) {
                            setServerErrors(data.errors)
                            return data;
                        } else {
                            setShowConfirmRes(false)
                            setEditReservation(null)
                            const resDate = new Date(date);
                            resDate.setHours(0,0,0,0);
                            setSelectedDate(resDate)
                            return data;
                        }
                    })
                }
                if (newGuestResult.errors) setServerErrors(newGuestResult.errors);
                return newGuestResult;
            }
            // const uknownError = {"errors": ["not hitting any handleResSubmit conditions"]}
            // setErrors(uknownError.errors)
            // return uknownError

    }
    //TODO:
                // update selected reservation with date/time/tags/party that changed
            // if guest is not selected
                // create new guest with info entered
                // update reservation with the new guest and date/time/tags/party if changed
    // NEW RESERVATION
    const handleResSubmit = async () => {
        // if guest is selected but none of the edits are present
        if (selectedGuest && !editEmailField && !editNameField && !editNumberField && !editNotesField) {
            dispatch(newReservation(selectedGuest.id, date, partySize, table, tags))
                .then((data) => {
                    if (data.errors) {
                        setServerErrors(data.errors)
                        return data;
                    } else {
                        setShowConfirmRes(false)
                        setShowMakeRes(false)
                        const resDate = new Date(date);
                        resDate.setHours(0,0,0,0);
                        setSelectedDate(resDate)
                        return data;
                    }
                })
        }
        // if guest is selected and any edit is present
        if (selectedGuest && (editEmailField || editNameField || editNumberField || editNotesField)) {
            const updatedGuestResult = await updateGuestFetch(selectedGuest.id, name, notes, phoneNumber, email)
            // if update is success
            if (updatedGuestResult.result) {
                dispatch(newReservation(selectedGuest.id, date, partySize, table, tags))
                .then((data) => {
                    if (data.errors) {
                        setServerErrors(data.errors)
                        return data;
                    } else {
                        setShowConfirmRes(false)
                        setShowMakeRes(false)
                        const resDate = new Date(date);
                        resDate.setHours(0,0,0,0);
                        setSelectedDate(resDate)
                        return data;
                    }
                })
            }
            if (updatedGuestResult.errors) setServerErrors(updatedGuestResult.errors);
            return updatedGuestResult;
        }
        // if not guest is selected
        if (!selectedGuest) {
            const newGuestResult = await newGuestFetch(name, notes, phoneNumber, email);
            if (newGuestResult.result) {
                dispatch(newReservation(newGuestResult.guest.id, date, partySize, table, tags))
                .then((data) => {
                    if (data.errors) {
                        setServerErrors(data.errors)
                        return data;
                    } else {
                        setShowConfirmRes(false)
                        setShowMakeRes(false)
                        const resDate = new Date(date);
                        resDate.setHours(0,0,0,0);
                        setSelectedDate(resDate)
                        return data;
                    }
                })
            }
            if (newGuestResult.errors) setServerErrors(newGuestResult.errors);
            return newGuestResult;
        }
        // const uknownError = {"errors": ["not hitting any handleResSubmit conditions"]}
        // setErrors(uknownError.errors)
        // return uknownError
    }

    return(
        <div className={style.modal_background}>
            <div className={style.error_submission_modal}>
                <div className={style.title_bar}>{serverErrors.length < 1 ? "Confirm Submission" : "It seems there is an issue..."}</div>
                {!serverErrors.length && <ul className={style.reservation_details}>
                    <li key={'title'}>Your reservation:</li>
                    <li key={'party'}>{`${partySize} ${partySize === 1 ? 'Guest' : 'Guests'}`}</li>
                    <li key={'time'}>{`at ${new Date(date).toLocaleTimeString('en-Us', { hour: 'numeric', minute: '2-digit' })}`}</li>
                    <li key={'date'}>{`on ${new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`}</li>
                    <li key={'name'}> {`for ${selectedGuest ? selectedGuest.name : name}`}</li>
                    </ul>}
                {serverErrors.length && <div className={style.errors}>
                    <div className={style.error_message}></div>
                    {serverErrors.map((error)=>{
                        return(<div className={style.error_description}>{error}</div>)
                    })}
                    </div>}
                    {!serverErrors.length && <div className={style.button_area}>
                    {editReservation && <div onClick={handleResUpdate} className={style.confirm_button}>Confirm Reservation</div>}
                    {!editReservation && <div onClick={handleResSubmit} className={style.confirm_button}>Confirm Reservation</div>}
                    <div onClick={()=>setShowConfirmRes(false)} className={style.return_button}>Return</div>
                        </div>}
                {serverErrors.length && <div className={style.button_area}>
                        <div onClick={()=>setShowConfirmRes(false)} className={style.return_button}>Return</div>
                    </div>}
            </div>
        </div>
    )
}

export default ConfirmResModal;
