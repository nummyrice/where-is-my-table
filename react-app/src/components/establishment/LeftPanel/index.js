import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import style from "./LeftPanel.module.css";
import AddReservation from '../AddReservation';
import { ReactComponent as WaitlistIcon } from './assets/user-clock-solid.svg';
import { ReactComponent as BookIcon } from './assets/book-open-solid.svg';
import { ReactComponent as LeftCaret } from './assets/caret-left-solid.svg';
import { ReactComponent as DownCaret } from './assets/caret-down-solid.svg'
import { getSevenDayAvailability } from '../../../store/sevenDayAvailability.js';



const LeftPanel = ({selectedDate}) => {
    const dispatch = useDispatch();
    const [viewBooked, setViewBooked] = useState(false);
    const [viewWaitlist, setViewWaitlist] = useState(false);
    const [showMakeRes, setShowMakeRes] = useState(false);
    const [showAddWait, setShowAddWait] = useState(false);
    return (
        <div className={style.left_panel}>
            {showMakeRes && <AddReservation setShowMakeRes={setShowMakeRes}/>}
            <input className={style.search}></input>
            <div className={style.filter_bar}>
                <div className={style.sort_by}>Sort By</div>
                <div className={style.order}>Order</div>
            </div>
            <div className={style.booked_bar}>
                <div className={style.label}> Booked </div>
                <div onClick={() => {
                    setShowMakeRes(true)
                    dispatch(getSevenDayAvailability(selectedDate))
                    }} className={style.add_button}>
                    <BookIcon className={style.icon}/>
                    <div className={style.label}> Add </div>
                </div>
                {viewBooked && <DownCaret onClick={() => {setViewBooked(false)}} className={style.icon}/>}
                {!viewBooked && <LeftCaret onClick={() => {setViewBooked(true)}} className={style.icon}/>}
            </div>
            <div className={style.waitlist_bar}>
                <div className={style.label}> Waitlist </div>
                <div onClick={() => {setShowAddWait(true)}} className={style.add_button}>
                    <WaitlistIcon className={style.icon}/>
                    <div className={style.label}> Add </div>
                </div>
                {viewWaitlist && <DownCaret onClick={() => {setViewWaitlist(false)}} className={style.icon}/>}
                {!viewWaitlist && <LeftCaret onClick={() => {setViewWaitlist(true)}} className={style.icon}/>}
            </div>
        </div>
    )
}

export default LeftPanel;
