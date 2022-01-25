import React, { useState } from 'react';
import style from './AddWaitlist.module.css';
import {ReactComponent as X} from '../AddReservation/assets/times-solid.svg';
import AddGuest from '../AddGuest';

// add state in left panel
// add title bar for edit displaying current waitlist info
// must handle passing these props to AddGuest: selectDateIndex={selectDateIndex} selectTimeIndex={selectTimeIndex}
const AddWaitlist = ({editWaitlist, setEditWaitlist, setShowAddWaitlist}) => {
    const [partySize, setPartySize] = useState(editWaitlist ? editWaitlist.party_size : 1)
    const [estimatedWait, setEstimatedWait] = useState(editWaitlist ? editWaitlist.estimated_wait : 5)
    const partySizeModel = Array(21).fill(0).map((space, guestNum) => guestNum + 1);
    const estimatedWaitModel = Array(20).fill(5).map((minutes, multiplier) => minutes * multiplier);

    return (
        <div className={style.modal_background}>
            <div className={style.modal}>
                {!editWaitlist && <div className={style.title}>Add to Waitlist</div>}
                {editWaitlist && <div className={style.title}>{`Edit Party Details`}</div>}
                {editWaitlist && <X onClick={() => {setEditWaitlist('')}} className={style.icon}/>}
                {!editWaitlist && <X onClick={() => {setShowAddWaitlist(false)}} className={style.icon}/>}
                <div className={style.date}>
                    <div className={style.top_scroll_space}></div>
                        <div className={style.date_cell_select}>Today</div>
                <div className={style.bottom_scroll_space}></div>
                </div>
                <div className={style.party_size}>
                    <div className={style.top_scroll_space}></div>
                    {partySizeModel.map((guestNum, index) => {
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
                    {estimatedWaitModel.map((wait, index) => {
                        // const datetime = new Date(availableTime.datetime);
                        // const localTimeString = datetime.toLocaleTimeString('en-Us', { hour: 'numeric', minute: '2-digit' });
                            return (
                                <div onClick={() => {
                                    setEstimatedWait(wait)
                                    }} key={index}
                                    className={estimatedWait === wait ? style.time_cell_select : style.time_cell}>
                                    <div className={style.time_text}>{`${wait} minutes`}</div>
                                </div>
                            )

                        }
                    )}
                    <div className={style.bottom_scroll_space}></div>
                </div>
                <AddGuest editWaitlist={editWaitlist} setEditWaitlist={setEditWaitlist} setShowAddWaitlist={setShowAddWaitlist} partySize={partySize} estimatedWait={estimatedWait}/>
            </div>
        </div>
    )
}

export default AddWaitlist
