import React from 'react';
import { useSelector } from 'react-redux';
import style from "./Establishment.module.css";
import { Route, Redirect } from 'react-router-dom';
import ResSchedule from './ResSchedule'



const Establishment = () => {
    const user = useSelector(state => state.session.user)

    return (
       <div className={style.establishment}>
            <div className={style.top_bar}></div>
            <div className={style.left_panel}></div>
            <ResSchedule/>
       </div>
    )
}

export default Establishment
