import React, { useState, useContext } from 'react';
import { EstablishmentContext } from '..';
import { useDispatch } from 'react-redux';
import style from "./LeftPanel.module.css";
import AddReservation from '../AddReservation';
import ResList from './ResList';
import Waitlist from './Waitlist';
import AddWaitlist from '../AddWaitlist';
import BookReservation from '../BookReservation';
import { ReactComponent as WaitlistIcon } from './assets/user-clock-solid.svg';
import { ReactComponent as BookIcon } from './assets/book-open-solid.svg';
import { ReactComponent as LeftCaret } from './assets/caret-left-solid.svg';
import { ReactComponent as DownCaret } from './assets/caret-down-solid.svg'
import { getSevenDayAvailability } from '../../../store/sevenDayAvailability.js';
// import { getSelectedDateAvailability } from '../../../store/selectedDateAvailability';

const LeftPanel = () => {
    const dispatch = useDispatch();
    const [viewBooked, setViewBooked] = useState(true);
    const [viewWaitlist, setViewWaitlist] = useState(true);
    const [showMakeRes, setShowMakeRes] = useState(false);
    const [showAddWaitlist, setShowAddWaitlist] = useState(false);
    const [bookRes, setBookRes] = useState(null);
    const { selectedDate } = useContext(EstablishmentContext);


    return (
        <div className={style.left_panel}>
            {showMakeRes && <AddReservation setShowMakeRes={setShowMakeRes}/>}
        {showAddWaitlist && <AddWaitlist setShowAddWaitlist={setShowAddWaitlist} showAddWaitlist={showAddWaitlist}/>}
            <input className={style.search}></input>
            <div className={style.filter_bar}>
                <div onClick={()=>setBookRes('new')} className={style.sort_by}>Sort By</div>
                <div className={style.order}>Order</div>
            </div>
            <div className={style.booked_bar}>
                <div className={style.label}> Booked </div>
                <div onClick={() => {
                    dispatch(getSevenDayAvailability(selectedDate)).then( () => {
                        setShowMakeRes(true)
                    })
                    }} className={style.add_button}>
                    <BookIcon className={style.icon}/>
                    <div className={style.label}> Add </div>
                </div>
                {viewBooked && <DownCaret onClick={() => {setViewBooked(false)}} className={style.icon}/>}
                {!viewBooked && <LeftCaret onClick={() => {setViewBooked(true)}} className={style.icon}/>}
            </div>
            {viewBooked && <ResList/>}
            <div className={style.waitlist_bar}>
                <div className={style.label}> Waitlist </div>
                <div onClick={() => {setShowAddWaitlist(true)}} className={style.add_button}>
                    <WaitlistIcon className={style.icon}/>
                    <div className={style.label}> Add </div>
                </div>
                {viewWaitlist && <DownCaret onClick={() => {setViewWaitlist(false)}} className={style.icon}/>}
                {!viewWaitlist && <LeftCaret onClick={() => {setViewWaitlist(true)}} className={style.icon}/>}
            </div>
            {viewWaitlist && <Waitlist/>}
            {bookRes && <BookReservation setShowBookRes={setBookRes} bookRes={bookRes}/>}
        </div>
    )
}

export default LeftPanel;
