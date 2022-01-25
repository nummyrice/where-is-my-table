import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import style from './AddReservation.module.css';
import {ReactComponent as X} from './assets/times-solid.svg';
import AddGuest from '../AddGuest';

const AddReservation = ({setShowMakeRes, setEditReservation, editReservation}) => {
    const sevenDayAvailability = useSelector((state) => state.sevenDayAvailability);
    const initialTimeIndex = sevenDayAvailability[0].availability.findIndex((table) => {
        const tableTime = new Date(table.datetime);
        return tableTime > new Date();
    })
    const [selectDateIndex, setselectDateIndex] = useState(0)
    const [selectTimeIndex, setselectTimeIndex] = useState(initialTimeIndex)
    const [partySize, setPartySize] = useState(sevenDayAvailability[selectDateIndex].availability[selectTimeIndex]?.table.max_seat)

    // RETURNS ARRAY OF GUEST NUM FOR TABLE
    const tableCapacity = (function getCapacity() {
        const tableMin = sevenDayAvailability[selectDateIndex].availability[selectTimeIndex]?.table.min_seat
        const tableMax = sevenDayAvailability[selectDateIndex].availability[selectTimeIndex]?.table.max_seat
        const guestNum = [];
        for (let index = tableMin; index <= tableMax; index++) {
            guestNum.push(index);
        }
        return guestNum;
    })()

    return (
        <div className={style.modal_background}>
            <div className={style.modal}>
                {!editReservation && <div className={style.title}>Make a Reservation</div>}
                {editReservation && <div className={style.title}>{`Edit Reservation: ${new Date(editReservation.reservation_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} ${new Date(editReservation.reservation_time).toLocaleDateString()}`}</div>}
                {editReservation && <X onClick={() => {setEditReservation('')}} className={style.icon}/>}
                {!editReservation && <X onClick={() => {setShowMakeRes(false)}} className={style.icon}/>}
                <div className={style.date}>
                    <div className={style.top_scroll_space}></div>
                {sevenDayAvailability && sevenDayAvailability.map((day, index) => {
                    const cellDate = new Date(day.date);
                    const dateText = cellDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
                    const weekday = cellDate.toLocaleDateString('en-US', {weekday: 'short'});
                    const weekdayChar = weekday.slice(0,1);

                    return(
                        <div onClick={() => {
                            setselectDateIndex(index)
                            setselectTimeIndex(0)
                            setPartySize(sevenDayAvailability[index].availability[0].table.min_seat)
                            }} key={index} className={new Date(sevenDayAvailability[selectDateIndex].date).getTime() === cellDate.getTime() ? style.date_cell_select : style.date_cell}>
                            <div className={style.weekday}>{weekdayChar}</div>
                            <div className={style.date_text}>{dateText}</div>
                        </div>
                    )
                })}
                <div className={style.bottom_scroll_space}></div>
                </div>
                <div className={style.party_size}>
                    <div className={style.top_scroll_space}></div>
                    {tableCapacity.length > 0 && tableCapacity.map((guestNum, index) => {
                        return(
                            <div onClick={() => {
                                setPartySize(guestNum)
                            }} key={index} className={partySize === guestNum ? style.party_cell_select : style.party_cell}>
                            <div className={style.guest_num}>{`${guestNum} ${guestNum === 1 ? 'Guest' : 'Guests'}`}</div>
                       </div>
                        )
                    })}
                    <div className={style.bottom_scroll_space}></div>
                </div>
                <div className={style.time}>
                    <div className={style.top_scroll_space}></div>
                    {sevenDayAvailability[selectDateIndex]?.availability.length > 0 && sevenDayAvailability[selectDateIndex].availability.map((availableTime, index) => {
                        const datetime = new Date(availableTime.datetime);
                        const localTimeString = datetime.toLocaleTimeString('en-Us', { hour: 'numeric', minute: '2-digit' });
                        if (datetime > new Date()) {
                            return (
                                <div onClick={() => {
                                    setselectTimeIndex(index)
                                    setPartySize(sevenDayAvailability[selectDateIndex].availability[index].table.min_seat)
                                }} key={index}className={new Date(sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime).getTime() === datetime.getTime() &&  sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].table.table_name === availableTime.table.table_name ? style.time_cell_select : style.time_cell}>
                                    <div className={style.time_text}>{localTimeString}</div>
                                    <div className={style.table}>{availableTime.table.table_name}</div>
                                </div>
                            )
                        } else {
                            return(null);
                        }
                    })}
                    <div className={style.bottom_scroll_space}></div>
                </div>
                <AddGuest editReservation={editReservation} setEditReservation={setEditReservation} setShowMakeRes={setShowMakeRes} selectDateIndex={selectDateIndex} selectTimeIndex={selectTimeIndex} partySize={partySize}/>
            </div>
        </div>
    )
}
export default AddReservation
