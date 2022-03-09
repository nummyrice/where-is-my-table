import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { newGuestFetch, updateGuestFetch } from '../utils';
import { newReservation, updateReservation } from '../../../store/selectedDateAvailability';
import style from './AddGuest.module.css';

const ConfirmResModal = ({errors, name, editReservation, setEditReservation, setShowMakeRes, setShowConfirmRes, date, table, partySize, notes, phoneNumber, email, tags, editNameField, editEmailField, editNumberField, editNotesField, selectedGuest, handleNewResSubmit, handleResUpdate}) => {
    const dispatch = useDispatch();
    // const [serverErrors, setServerErrors] = useState(errors);



    //TODO:
                // update selected reservation with date/time/tags/party that changed
            // if guest is not selected
                // create new guest with info entered
                // update reservation with the new guest and date/time/tags/party if changed


    return(
        <div className={style.modal_background}>
            <div className={style.error_submission_modal}>
                <div className={style.title_bar}>{errors.length < 1 ? "Confirm Submission" : "It seems there is an issue..."}</div>
                {!errors.length && <ul className={style.reservation_details}>
                    <li key={'title'}>Your reservation:</li>
                    <li key={'party'}>{`${partySize} ${partySize === 1 ? 'Guest' : 'Guests'}`}</li>
                    <li key={'time'}>{`at ${new Date(date).toLocaleTimeString('en-Us', { hour: 'numeric', minute: '2-digit' })}`}</li>
                    <li key={'date'}>{`on ${new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`}</li>
                    <li key={'name'}> {`for ${selectedGuest ? selectedGuest.name : name}`}</li>
                    </ul>}
                {errors.length && <div className={style.errors}>
                    <div className={style.error_message}></div>
                    {errors.map((error)=>{
                        return(<div className={style.error_description}>{error}</div>)
                    })}
                    </div>}
                    {!errors.length && <div className={style.button_area}>
                    {editReservation && <div onClick={handleResUpdate} className={style.confirm_button}>Confirm Reservation</div>}
                    {!editReservation && <div onClick={handleNewResSubmit} className={style.confirm_button}>Confirm Reservation</div>}
                    <div onClick={()=>setShowConfirmRes(false)} className={style.return_button}>Return</div>
                        </div>}
                {errors.length && <div className={style.button_area}>
                        <div onClick={()=>setShowConfirmRes(false)} className={style.return_button}>Return</div>
                    </div>}
            </div>
        </div>
    )
}

export default ConfirmResModal;
