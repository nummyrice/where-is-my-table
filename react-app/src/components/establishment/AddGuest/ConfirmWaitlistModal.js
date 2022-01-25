import React, { useState, useContext } from 'react';
import style from './AddGuest.module.css';
import { EstablishmentContext } from '..';
import { newWaitlistFetch, newGuestFetch, updateGuestFetch } from '../utils';



const ConfirmWaitlistModal = ({errors, partySize, estimatedWait, selectedGuest, name, notes, phoneNumber, email, tags, editWaitlist, setEditWaitlist, setShowAddWaitlist, setShowConfirmWaitlist, editNameField, editEmailField, editNumberField, editNotesField}) => {
    const {setSelectedDate, selectedDate} = useContext(EstablishmentContext);
    const [serverErrors, setServerErrors] = useState(errors);

    const handleWaitlistUpdate = async () => {

    }

    const handleWaitlistSubmit = async () => {
         // if guest is selected but none of the edits are present
        if (selectedGuest && !editEmailField && !editNameField && !editNumberField && !editNotesField) {
            const fetchResult = await newWaitlistFetch(selectedGuest.id, partySize, estimatedWait, tags)
            console.log('FETCH RESULT: ', fetchResult)
            if (fetchResult.errors) setServerErrors([...errors, ...fetchResult.errors]);
            return fetchResult;
        }
        // if guest is selected and any edit is present
        if (selectedGuest && (editEmailField || editNameField || editNumberField || editNotesField)) {
            const updatedGuestResult = await updateGuestFetch(selectedGuest.id, name, notes, phoneNumber, email)
            // if update is success
            if (updatedGuestResult.result) {
                if (selectedGuest && !editEmailField && !editNameField && !editNumberField && !editNotesField) {
                    const fetchResult = newWaitlistFetch(selectedGuest.id, partySize, estimatedWait, tags)
                    if (fetchResult.errors) setServerErrors([...errors, ...fetchResult.errors]);
                    return fetchResult
                }
                setServerErrors([...serverErrors, ...updatedGuestResult.errors]);
                return updatedGuestResult;
            }
            return updatedGuestResult;
        }
        // if guest is NOT selected
        if (!selectedGuest) {
            const newGuestResult = await newGuestFetch(name, notes, phoneNumber, email)
            // if post is success
            if (newGuestResult.result) {
                const fetchResult = newWaitlistFetch(selectedGuest.id, partySize, estimatedWait, tags)
                if (fetchResult.errors) setServerErrors([...errors, ...fetchResult.errors]);
                return fetchResult
            }
            console.log('not getting a success result', newGuestResult)
            setServerErrors([...serverErrors, ...newGuestResult.errors]);
            return newGuestResult;
        }
        const uknownError = {"errors": ["not hitting any handleResSubmit conditions"]}
        setServerErrors([...uknownError.errors, ...serverErrors])
        return uknownError
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
                {editWaitlist && <div onClick={async ()=>{
                        const result = handleWaitlistUpdate();
                        if (result.errors) {
                        }
                        else {
                            setShowConfirmWaitlist(false)
                            setEditWaitlist('')
                            // const reservedDate = new Date(sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime)
                            // reservedDate.setHours(0,0,0,0)
                            // setSelectedDate(reservedDate)
                        }
                        }} className={style.confirm_button}>Confirm Party</div>}
                {!editWaitlist && <div onClick={async ()=>{
                        const result = await handleWaitlistSubmit();
                        if (result.errors) {
                        }
                        else {
                            setShowConfirmWaitlist(false)
                            setShowAddWaitlist(false)
                            // const reservedDate = new Date(sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime)
                            // reservedDate.setHours(0,0,0,0)
                            // setSelectedDate(reservedDate)
                        }
                        }} className={style.confirm_button}>Confirm Reservation</div>}
                <div onClick={()=>{
                        setShowConfirmWaitlist(false)}} className={style.return_button}>Return</div>
                    </div>}
            {serverErrors.length > 0 && <div className={style.button_area}>
                    <div onClick={()=>{setShowConfirmWaitlist(false)}} className={style.return_button}>Return</div>
                </div>}
        </div>
    </div>
    )
}

export default ConfirmWaitlistModal
