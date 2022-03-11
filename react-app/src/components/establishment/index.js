import React, { useState, useEffect, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReservations } from '../../store/reservations';
import { getSelectedDateWaitlist } from '../../store/selectedDateWaitlist';
import style from "./Establishment.module.css";
// import { Route, Redirect } from 'react-router-dom';
import ResSchedule from './ResSchedule';
import TopBar from './TopBar';
import LeftPanel from './LeftPanel';

export const EstablishmentContext = createContext();

const Establishment = () => {
    const establishment = useSelector(state => state.session.user.establishment)
    const dispatch = useDispatch();
    // const user = useSelector(state => state.session.user)
    const today = new Date();
    today.setUTCHours(establishment.timezone_offset,0,0,0);
    console.log(today.toLocaleDateString('en-US', {timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric' }))
    const [selectedDate, setSelectedDate] = useState(today);
    useEffect(() => {
        dispatch(getReservations(selectedDate.toISOString())).then((data)=>{
            // console.log("SELECTED DATA ISO: ", selectedDate.toISOString() )
        })
        dispatch(getSelectedDateWaitlist(selectedDate.toISOString())).then((data) => {
            // console.log("Waitlist DATA", data)
        })
    }, [selectedDate, dispatch])

    return (
        <EstablishmentContext.Provider value={{selectedDate, setSelectedDate}}>
            <div className={style.establishment}>
                    <TopBar/>
                    <LeftPanel/>
                    <ResSchedule selectedDate={selectedDate}/>
            </div>
        </EstablishmentContext.Provider>
    )
}

export default Establishment;
