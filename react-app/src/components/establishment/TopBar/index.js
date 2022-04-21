import React, { useState, useContext} from 'react';
import { useSelector } from 'react-redux';
import { EstablishmentContext } from '..';
import SettingsSelector from '../Settings/SettingsSelector';
import style from './TopBar.module.css';
import { ReactComponent as SettingsIcon } from './assets/cogs-solid.svg';
import { ReactComponent as RightArrow } from './assets/arrow-right-solid.svg';
import { ReactComponent as LeftArrow } from './assets/arrow-left-solid.svg';
// import { ReactComponent as Calendar } from './assets/calendar-check-regular.svg';
import DateAdapter from '@mui/lab/AdapterLuxon';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';


const TopBar = ({periodIndex, handlePeriodChange}) => {
    const establishment = useSelector(state => state.session.user.establishment)
    const [showPanel, setShowPanel] = useState(false);
    const {setSelectedDate, selectedDate} = useContext(EstablishmentContext);
    const scrollToPeriods = ["change period", "now", "breakfast", "lunch", "dinner"]
    const handleDateChange = (date) => {
        setSelectedDate(date)
    }


    return(
        <div className={style.top_bar}>
            <div className={style.restaurant_title}>{establishment.name}</div>
            <div className={style.center_options}>
                <LeftArrow onClick={() => setSelectedDate(selectedDate.minus({days: 1}))} className={style.back_date}/>
                <div className={style.todays_date}>{selectedDate.toLocaleString({ weekday: 'long' })}</div>
                <LocalizationProvider dateAdapter={DateAdapter}>
                <DesktopDatePicker
                    label="Date desktop"
                    inputFormat="MM/dd/yyyy"
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params}
                    sx={{
                        '.MuiOutlinedInput-input': {
                            'backgroundColor': '#444',
                            'color': '#fff',
                            'height': '5px',
                            'margin': '3px',
                            "border": "2px solid #4c5868",
                            "borderRadius": "6px"
                        },
                        '.MuiButtonBase-root': {
                            'color': '#fff'
                        },
                        '.MuiButtonBase-root:hover': {
                            'color': '#808080',
                            'cursor': 'pointer'
                        }
                    }} />}
                />
                </LocalizationProvider>
                <div onClick={()=>handlePeriodChange(periodIndex)} className={style.dining_period}>{scrollToPeriods[periodIndex]}</div>
                <RightArrow onClick={() => setSelectedDate(selectedDate.plus({days: 1}))} className={style.forward_date}/>
            </div>
            <SettingsIcon onClick={()=>setShowPanel(!showPanel)} className={style.establishment_settings}/>
            {showPanel &&
            <SettingsSelector/>}
        </div>
    )
}

export default TopBar;
