import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import style from "./Establishment.module.css";
// import { Route, Redirect } from 'react-router-dom';
import ResSchedule from './ResSchedule';
import TopBar from './TopBar';
import LeftPanel from './LeftPanel';



const Establishment = () => {
    const user = useSelector(state => state.session.user)
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)

    return (
       <div className={style.establishment}>
            <TopBar setSelectedDate={setSelectedDate} selectedDate={selectedDate}/>
            <LeftPanel selectedDate={selectedDate}/>
            <ResSchedule selectedDate={selectedDate}/>
       </div>
    )
}

export default Establishment
