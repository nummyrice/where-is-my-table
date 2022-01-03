import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import style from './AddReservation.module.css';
import {ReactComponent as X} from './assets/times-solid.svg';
import AddGuest from '../AddGuest';

const AddReservation = ({setShowMakeRes}) => {
    const sevenDayAvailability = useSelector((state) => state.sevenDayAvailability);
    console.log('availability :', sevenDayAvailability)
    const [selectResDate, setSelectResDate] = useState(0)
    const [selectTime, setSelectTime] = useState(0)
    const [guestNum, setGuestNum] = useState()

    // RETURNS ARRAY OF OBJECTS FOR EACH TABLE/TIME AVAILABILITY
    const availableTimes = (function getAvailableTimes() {
        const availability = sevenDayAvailability[0]?.availability.map(availableTable => ({table: availableTable.table, datetime: availableTable.datetime}))
        return availability
    })()

    // RETURNS ARRAY OF GUEST NUM FOR TABLE
    const tableCapacity = (function getCapacity() {
        const tableMin = sevenDayAvailability[selectResDate].availability[selectTime].table.min_seat
        const tableMax = sevenDayAvailability[selectResDate].availability[selectTime].table.max_seat
        const guestNum = [];
        for (let index = tableMin; index <= tableMax; index++) {
            guestNum.push(index);
        }
        return guestNum;
    })()


    return (
        <div className={style.modal_background}>
            <div className={style.modal}>
                <div className={style.title}>Make a Reservation</div>
                <X onClick={() => {setShowMakeRes(false)}} className={style.icon}/>
                <div className={style.date}>
                {sevenDayAvailability && sevenDayAvailability.map((day, index) => {
                    const cellDate = new Date(day.date);
                    const dateText = cellDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
                    const weekday = cellDate.toLocaleDateString('en-US', {weekday: 'short'});
                    const weekdayChar = weekday.slice(0,1);

                    return(
                        <div key={index} className={style.date_cell}>
                            <div className={style.weekday}>{weekdayChar}</div>
                            <div className={style.date_text}>{dateText}</div>
                        </div>
                    )
                })}
                </div>
                <div className={style.party_size}>
                    {tableCapacity.length > 0 && tableCapacity.map((guestNum, index) => {
                        return(
                            <div key={index}className={style.party_cell}>
                            <div className={style.guest_num}>{`${guestNum} ${guestNum === 1 ? 'Guest' : 'Guests'}`}</div>

                       </div>
                        )
                    })}
                </div>
                <div className={style.time}>
                    {availableTimes.length > 0 && availableTimes.map((availableTime, index) => {
                        const datetime = new Date(availableTime.datetime);
                        const localTimeString = datetime.toLocaleTimeString('en-Us', { hour: 'numeric', minute: '2-digit' });
                        return (
                            <div key={index}className={style.time_cell}>
                                 <div className={style.time_text}>{localTimeString}</div>
                                <div className={style.table}>{availableTime.table.table_name}</div>
                            </div>
                        )
                    })}
                </div>
                <AddGuest/>
            </div>
        </div>
    )
}
export default AddReservation
