import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import style from './AddReservation.module.css';
import {ReactComponent as X} from './assets/times-solid.svg';

const AddReservation = ({setShowMakeRes}) => {
    const sevenDayAvailability = useSelector((state) => state.sevenDayAvailability);
    console.log('availability :', sevenDayAvailability[0].date)
    const initialSelectResDate = new Date(sevenDayAvailability?.[0].date);
    const initialSelectPartySize = sevenDayAvailability?.[0].availability[0].table.min_seat;
    const initialSelectTime = new Date(sevenDayAvailability?.[0].availability[0].datetime);
    const [selectResDate, setSelectResDate] = useState(initialSelectResDate)
    const [selectParySize, setSelectPartySize] = useState(initialSelectPartySize)
    const [selectTime, setSelectTime] = useState(initialSelectTime)
    return (
        <div className={style.modal_background}>
            <div className={style.modal}>
                <div className={style.title}>Make a Reservation</div>
                <X onClick={() => {setShowMakeRes(false)}} className={style.icon}/>
                <div className={style.date}>
                {selectResDate && sevenDayAvailability.map((day) => {
                    const cellDate = new Date(day.datetime);
                    const dateText = cellDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
                    const weekday = cellDate.toLocaleDateString('en-US', {weekday: 'short'});

                    return(
                        <div className={style.date_cell}>
                            <div className={style.weekday}>{weekday}</div>
                            <div className={style.date_text}>{dateText}</div>
                        </div>
                    )
                })}
                </div>
                <div className={style.party_size}></div>
                <div className={style.time}></div>
                <div className={style.add_guest_component}></div>
            </div>
        </div>
    )
}
export default AddReservation
