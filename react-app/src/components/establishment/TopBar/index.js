import React, { useState, useEffect, useContext} from 'react';
import { EstablishmentContext } from '..';
import Settings from '../Settings';
import style from './TopBar.module.css';
import { ReactComponent as SettingsIcon } from './assets/cogs-solid.svg';
import { ReactComponent as RightArrow } from './assets/arrow-right-solid.svg';
import { ReactComponent as LeftArrow } from './assets/arrow-left-solid.svg';
import { ReactComponent as Calendar } from './assets/calendar-check-regular.svg';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

const TopBar = () => {
    const [showPanel, setShowPanel] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const {setSelectedDate, selectedDate} = useContext(EstablishmentContext);
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
                <Calendar onClick={()=> setShowDatePicker(true)} className={style.calendar}/>
                <SingleDatePicker
                    id="datePicker"
                    date={moment(selectedDate)}
                    onDateChange={date => {
                        const newDate = date.toDate();
                        newDate.setUTCHours(0,0,0,0)
                        setSelectedDate(newDate)}}
                    focused={showDatePicker}
                    onFocusChange={({focused}) => setShowDatePicker(focused)}
                    />
                <div className={style.dining_period}>{'Dinner'}</div>
                <RightArrow onClick={() => {
                    const yesterday = new Date(selectedDate)
                    yesterday.setDate(selectedDate.getDate() + 1)
                    setSelectedDate(yesterday)
                }} className={style.forward_date}/>
            </div>
            <SettingsIcon onClick={()=>setShowPanel(!showPanel)} className={style.establishment_settings}/>
            {showPanel &&
            <Settings/>}
        </div>
    )
}

export default TopBar;
