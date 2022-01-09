import React, { useState, useEffect} from 'react'
import style from './TopBar.module.css'
import { ReactComponent as Settings } from './assets/cogs-solid.svg'
import { ReactComponent as RightArrow } from './assets/arrow-right-solid.svg'
import { ReactComponent as LeftArrow } from './assets/arrow-left-solid.svg'
import { ReactComponent as Calendar } from './assets/calendar-check-regular.svg'




const TopBar = ({setSelectedDate, selectedDate}) => {

    return(
        <div className={style.top_bar}>
            <div className={style.restaurant_title}>{'Village Baker'}</div>
            <div className={style.center_options}>
                <LeftArrow onClick={() => {
                    const yesterday = new Date(selectedDate)
                    yesterday.setDate(selectedDate.getDate() - 1)
                    setSelectedDate(yesterday)
                }} className={style.back_date}/>
                <div className={style.todays_date}>{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <Calendar className={style.calendar}/>
                <div className={style.dining_period}>{'Dinner'}</div>
                <RightArrow onClick={() => {
                    const yesterday = new Date(selectedDate)
                    yesterday.setDate(selectedDate.getDate() + 1)
                    setSelectedDate(yesterday)
                }} className={style.forward_date}/>
            </div>
            <Settings className={style.establishment_settings}/>
        </div>
    )
}

export default TopBar;
