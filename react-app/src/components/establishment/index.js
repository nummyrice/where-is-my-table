import React, { useState, useEffect, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedDateAvailability } from '../../store/selectedDateAvailability';
import { getSelectedDateWaitlist } from '../../store/selectedDateWaitlist';
import style from "./Establishment.module.css";
// import { Route, Redirect } from 'react-router-dom';
import ResSchedule from './ResSchedule';
import TopBar from './TopBar';
import LeftPanel from './LeftPanel';

export const EstablishmentContext = createContext();

const Establishment = () => {
    const dispatch = useDispatch();
    // const user = useSelector(state => state.session.user)
    const today = new Date();
    today.setHours(0,0,0,0);
    const [selectedDate, setSelectedDate] = useState(today);
    useEffect(() => {
        dispatch(getSelectedDateAvailability(selectedDate.toISOString())).then((data)=>{
            // console.log("Availability DATA: ", data)
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
