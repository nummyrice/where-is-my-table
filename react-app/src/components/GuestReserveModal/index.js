import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import {useSelector} from 'react-redux';
import style from './GuestReserveModal.module.css';
import { ReactComponent as UtensilsIcon} from './assets/utensils-solid.svg';
import {DateTime} from 'luxon'

const GuestReserveModal = ({selectedDate, setSelectedDate, availableTableTime, setShowGuestReserveModal}) => {
    const user = useSelector(state=>state.session?.user);
    const [partySize, setPartySize] = useState(availableTableTime.table_details.min_seat)
    const [notes, setNotes] = useState('')
    const [errors, setErrors] = useState([]);
    // party size selector array
    const partySizeOptions = (function getPartySize(){
        const result = [];
        for (let party = availableTableTime.table_details.min_seat; party <= availableTableTime.table_details.max_seat; party++) {
            result.push(party);
        }
        return result;
    })()

    // TODO: landing does not "refresh" after reservation submission or is mistakenly producing already reserved time slots
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newReservation = {
            guest_id: user.id,
            reservation_time: availableTableTime.res_time,
            party_size: partySize,
            notes: notes,
            table_id: availableTableTime.table_details.id,
            establishment_id: 1
        }
        //then post reservation
        const response = await fetch(`/api/reservations/new/village_baker`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newReservation)
        })
        const data = await response.json()
        if (!response.ok) {
            if (data.errors) {
                setErrors(data.errors);
                console.log(data.errors)
            }
            return data
        }
        setShowGuestReserveModal(false);
        return data

    }

    // TODO: allow user to add notes or tags
    if (!user) return <Redirect to='/login'/>;
    return(
        <div className={style.background}>
            <form onSubmit={handleSubmit} id={style.guest_res_modal}>
                <span id={style.guest_res_header}>
                    <UtensilsIcon/>
                    <span>{`Reserve ${availableTableTime.table_details.table_name}`}</span>
                </span>
                {errors.length > 0 && errors.map((error)=>{
                    return(
                        <div className={style.errors}>{error}</div>
                    )
                })}
                <div>
                    <span>{`${DateTime.fromISO(availableTableTime.res_time).toLocaleString({month: 'short', day: 'numeric'})} ${DateTime.fromISO(availableTableTime.res_time).toLocaleString({hour: '2-digit', minute: '2-digit'})}`}</span>
                </div>
                <div>
                    <label id={style.name_label}>Party Name:</label>
                    <span>{user.name}</span>
                </div>
                <div>
                    <label id={style.party_label}>Party Size:</label>
                    <select onChange={(e)=> setPartySize(e.target.value)}>
                        {partySizeOptions.map((num) => {
                            return(
                                <option key={`guest_${num}`} value={num}>{num}</option>
                            )
                        })}
                    </select>
                </div>
                {/* <div id={style.notes_section}>
                    <label>Notes:</label>
                    <textarea onChange={ e => setNotes(e.target.value)} name="notes" cols="15" rows="2"></textarea>
                </div> */}
                <span id={style.buttons}>
                    <button type='button' onClick={()=>setShowGuestReserveModal(false)}>Back</button>
                    <button type='submit'>Confirm</button>
                </span>
            </form>
        </div>
    )
}

export default GuestReserveModal;
