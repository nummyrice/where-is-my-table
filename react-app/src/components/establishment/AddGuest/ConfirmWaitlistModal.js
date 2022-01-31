import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import style from './AddGuest.module.css';
import { EstablishmentContext } from '..';
import { newGuestFetch, updateGuestFetch } from '../utils';
import { newWaitlistParty, updateWaitlistParty } from '../../../store/selectedDateWaitlist';



const ConfirmWaitlistModal = ({errors, partySize, estimatedWait, selectedGuest, name, notes, phoneNumber, email, tags, editWaitlist, setEditWaitlist, setShowAddWaitlist, setShowConfirmWaitlist, editNameField, editEmailField, editNumberField, editNotesField}) => {
    const dispatch = useDispatch();
    const {selectedDate} = useContext(EstablishmentContext);
    const [serverErrors, setServerErrors] = useState(errors);

    // UPDATE PARTY
    const handleWaitlistUpdate = async () => {
                // if guest is selected but none of the edits are present
                if (selectedGuest && !editEmailField && !editNameField && !editNumberField && !editNotesField) {
                    dispatch(updateWaitlistParty(editWaitlist.id, selectedGuest.id, partySize, estimatedWait, tags))
                        .then((data) => {
                            if (data.errors) {
                                setServerErrors(data.errors)
                                return data;
                            } else {
                                setShowConfirmWaitlist(false)
                                setEditWaitlist(null)
                                return data;
                            }
                        })
                }
                // if guest is selected and any edit is present
                if (selectedGuest && (editEmailField || editNameField || editNumberField || editNotesField)) {
                    const updatedGuestResult = await updateGuestFetch(selectedGuest.id, name, notes, phoneNumber, email)
                    // if update is success
                    if (updatedGuestResult.result) {
                            dispatch(updateWaitlistParty(editWaitlist.id, selectedGuest.id, partySize, estimatedWait, tags))
                            .then((data) => {
                                if (data.errors) {
                                    setServerErrors([data.errors]);
                                } else {
                                    setShowConfirmWaitlist(false)
                                    setEditWaitlist(null)
                                    return data;
                                }
                            })
                    }
                    // setServerErrors([...serverErrors, ...updatedGuestResult.errors]);
                    return updatedGuestResult;
                }
                // if guest is NOT selected
                if (!selectedGuest) {
                    const newGuestResult = await newGuestFetch(name, notes, phoneNumber, email)
                    // if post is success
                    if (newGuestResult.result) {
                        dispatch(updateWaitlistParty(editWaitlist.id, newGuestResult.guest.id, partySize, estimatedWait, tags))
                        .then((data) => {
                            if (data.errors) {
                                setServerErrors(data.errors)
                                return data;
                            } else {
                                setShowConfirmWaitlist(false)
                                setEditWaitlist(null)
                                return data;
                            }
                        })
                    }
                    // setServerErrors([...serverErrors, ...newGuestResult.errors]);
                    return newGuestResult;
                }
                // const uknownError = {"errors": ["not hitting any handleResSubmit conditions"]}
                // setServerErrors([...uknownError.errors, ...serverErrors])
                // return uknownError
    }


    // NEW PARTY
    const handleWaitlistSubmit = async () => {
         // if guest is selected but none of the edits are present
        if (selectedGuest && !editEmailField && !editNameField && !editNumberField && !editNotesField) {
            dispatch(newWaitlistParty(selectedGuest.id, partySize, estimatedWait, tags))
                .then((data) => {
                    if (data.errors) {
                        setServerErrors(data.errors)
                        return data;
                    } else {
                        setShowConfirmWaitlist(false)
                        setShowAddWaitlist(false)
                        return data;
                    }
                })
        }
        // if guest is selected and any edit is present
        if (selectedGuest && (editEmailField || editNameField || editNumberField || editNotesField)) {
            const updatedGuestResult = await updateGuestFetch(selectedGuest.id, name, notes, phoneNumber, email)
            // if update is success
            if (updatedGuestResult.result) {
                    dispatch(newWaitlistParty(selectedGuest.id, partySize, estimatedWait, tags))
                    .then((data) => {
                        if (data.errors) {
                            setServerErrors([data.errors]);
                            return data;
                        } else {
                            setShowConfirmWaitlist(false)
                            setShowAddWaitlist(false)
                            return data;
                        }
                    })
            }
            // setServerErrors([...serverErrors, ...updatedGuestResult.errors]);
            return updatedGuestResult;
        }
        // if guest is NOT selected
        if (!selectedGuest) {
            const newGuestResult = await newGuestFetch(name, notes, phoneNumber, email)
            // if post is success
            if (newGuestResult.result) {
                dispatch(newWaitlistParty(newGuestResult.guest.id, partySize, estimatedWait, tags))
                .then((data) => {
                    if (data.errors) {
                        setServerErrors(data.errors)
                        return data;
                    } else {
                        setShowConfirmWaitlist(false)
                        setShowAddWaitlist(false)
                        return data;
                    }
                })
            }
            // setServerErrors([...serverErrors, ...newGuestResult.errors]);
            return newGuestResult;
        }
        // const uknownError = {"errors": ["not hitting any handleResSubmit conditions"]}
        // setServerErrors([...uknownError.errors, ...serverErrors])
        // return uknownError
    }


    return(
        <div className={style.modal_background}>
        <div className={style.error_submission_modal}>
            <div className={style.title_bar}>{errors.length < 1 ? "Confirm Submission" : "It seems there is an issue..."}</div>
            {!serverErrors.length && <ul className={style.reservation_details}>
                <li>New Party:</li>
                <li>{`${partySize} ${partySize === 1 ? 'Guest' : 'Guests'}`}</li>
                <li>{`in about ${estimatedWait} minutes`}</li>
                <li>{`on ${new Date(selectedDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`}</li>
                <li> {`under name ${selectedGuest ? selectedGuest.name : name}`}</li>
                </ul>}
            {serverErrors.length > 0 && <div className={style.errors}>
                <div className={style.error_message}></div>
                {serverErrors.map((error)=>{
                    return(
                        <div className={style.error_description}>{error}</div>
                    )
                })}
                </div>}
                {!serverErrors.length && <div className={style.button_area}>
                {editWaitlist && <div onClick={handleWaitlistUpdate} className={style.confirm_button}>Confirm Update</div>}
                {!editWaitlist && <div onClick={handleWaitlistSubmit} className={style.confirm_button}>Confirm Party Info</div>}
                <div onClick={()=>{setShowConfirmWaitlist(false)}} className={style.return_button}>Return</div>
                    </div>}
            {serverErrors.length > 0 && <div className={style.button_area}>
                    <div onClick={()=>{setShowConfirmWaitlist(false)}} className={style.return_button}>Return</div>
                </div>}
        </div>
    </div>
    )
}

export default ConfirmWaitlistModal
