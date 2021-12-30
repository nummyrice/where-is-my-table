import React, { useState, useEffect } from 'react';
import style from "./LeftPanel.module.css";
import { ReactComponent as WaitlistIcon } from './assets/user-clock-solid.svg';
import { ReactComponent as BookIcon } from './assets/book-open-solid.svg';
import { ReactComponent as LeftCaret } from './assets/caret-left-solid.svg';
import { ReactComponent as DownCaret } from './assets/caret-down-solid.svg'


const LeftPanel = ({selectedDate}) => {
    const [viewBooked, setViewBooked] = useState(false);
    const [viewWaitlist, setViewWaitlist] = useState(false);
    return (
        <div className={style.left_panel}>
            <input className={style.search}></input>
            <div className={style.filter_bar}>
                <div className={style.sort_by}>Sort By</div>
                <div className={style.order}>Order</div>
            </div>
            <div className={style.booked_bar}>
                <div className={style.label}> Booked </div>
                <div className={style.add_button}>
                    <BookIcon className={style.icon}/>
                    <div className={style.label}> Add </div>
                </div>
                {viewBooked && <DownCaret onClick={() => {setViewBooked(false)}} className={style.icon}/>}
                {!viewBooked && <LeftCaret onClick={() => {setViewBooked(true)}} className={style.icon}/>}
            </div>
            <div className={style.waitlist_bar}>
                <div className={style.label}> Waitlist </div>
                <div className={style.add_button}>
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
