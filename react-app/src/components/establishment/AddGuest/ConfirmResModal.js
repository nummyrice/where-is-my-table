import React from 'react';
import style from './AddGuest.module.css';

const ConfirmResModal = ({ bookRes, name, setShowConfirmRes, resTime, selectedSection, partySize, selectedGuest, handleNewResSubmit, handleResUpdate}) => {
    // const [serverErrors, setServerErrors] = useState(errors);
    //TODO:
                // update selected reservation with date/time/tags/party that changed
            // if guest is not selected
                // create new guest with info entered
                // update reservation with the new guest and date/time/tags/party if changed
                // console.log('TYPE OF RESTIME: ', resTime)
                console.log('selected guest: ', selectedGuest)
    return(

        <div className={style.error_submission_modal}>
            <div className={style.title_bar}>{"Confirm Submission"}</div>
            <ul className={style.reservation_details}>
                <li key={'title'}>Your reservation:</li>
                <li key={'party'}>{`${partySize} ${partySize === 1 ? 'Guest' : 'Guests'}`}</li>
                <li key={'time'}>{`at ${resTime.toLocaleString({hour: 'numeric', minute: '2-digit' })}`}</li>
                <li key={'date'}>{`on ${resTime.toLocaleString({month: 'short', day: 'numeric'})}`}</li>
                <li key={'name'}> {`for ${selectedGuest ? selectedGuest.name : name}`}</li>
            </ul>
                <div className={style.button_area}>
                    {!(bookRes === 'new') && <div onClick={handleResUpdate} className={style.confirm_button}>Confirm Reservation</div>}
                    {bookRes === 'new' && <div onClick={handleNewResSubmit} className={style.confirm_button}>Confirm Reservation</div>}
                    <div onClick={()=>setShowConfirmRes(false)} className={style.return_button}>Return</div>
                </div>
        </div>

    )
}

export default ConfirmResModal;
