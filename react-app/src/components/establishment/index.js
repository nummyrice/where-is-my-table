import React, { useState, useEffect, createContext } from 'react';
import { useSelector } from 'react-redux';
import style from "./Establishment.module.css";
// import { Route, Redirect } from 'react-router-dom';
import ResSchedule from './ResSchedule';
import TopBar from './TopBar';
import LeftPanel from './LeftPanel';

export const EstablishmentContext = createContext();

const Establishment = () => {
    const user = useSelector(state => state.session.user)
    const today = new Date()
    today.setHours(0,0,0,0)
    const [selectedDate, setSelectedDate] = useState(today)

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

export default Establishment
