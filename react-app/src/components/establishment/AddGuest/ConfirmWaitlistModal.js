import React, { useContext } from 'react';
import style from './AddGuest.module.css';
import { EstablishmentContext } from '..';



const ConfirmWaitlistModal = ({handleNewPartySubmit, handlePartyUpdate, errors, partySize, estimatedWait, selectedGuest, name, notes, phoneNumber, email, tags, editWaitlist, setEditWaitlist, setShowAddWaitlist, setShowConfirmParty, editNameField, editEmailField, editNumberField, editNotesField}) => {
    const {selectedDate} = useContext(EstablishmentContext);
    return(
        <div className={style.modal_background}>
        <div className={style.error_submission_modal}>
            <div className={style.title_bar}>{"Confirm Submission"}</div>
            <ul className={style.reservation_details}>
                <li>New Party:</li>
                <li>{`${partySize} ${partySize === 1 ? 'Guest' : 'Guests'}`}</li>
                <li>{`in about ${estimatedWait} minutes`}</li>
                <li>{`on ${new Date(selectedDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`}</li>
                <li> {`under name ${selectedGuest ? selectedGuest.name : name}`}</li>
                </ul>
                <div className={style.button_area}>
                    {editWaitlist && <div onClick={handlePartyUpdate} className={style.confirm_button}>Confirm Update</div>}
                    {!editWaitlist && <div onClick={handleNewPartySubmit} className={style.confirm_button}>Confirm Party Info</div>}
                    <div onClick={()=>{setShowConfirmParty(false)}} className={style.return_button}>Return</div>
                </div>
        </div>
    </div>
    )
}

export default ConfirmWaitlistModal
