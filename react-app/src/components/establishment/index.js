import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import style from "./Establishment.module.css";
import { Route, Redirect } from 'react-router-dom';
import ResSchedule from './ResSchedule'
import TopBar from './TopBar'



const Establishment = () => {
    const user = useSelector(state => state.session.user)
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)

    return (
       <div className={style.establishment}>
            <TopBar setSelectedDate={setSelectedDate}/>
            <div className={style.left_panel}></div>
            <ResSchedule selectedDate={selectedDate}/>
       </div>
    )
}

export default Establishment
