import React from 'react';
// import { useSelector } from 'react-redux';
import style from './Settings.module.css'

const DisplaySection = ({section, setEditSections, editSections}) => {


    return(
        <React.Fragment key={section.id}>
            <h2 className={style.display_section_name}>{section.name}</h2>
            <div className={style.display_section}>
                <h3>{"Section Schedule"}</h3>
                {Object.keys(section.schedule).map(day => {
                    const dailySchedule = section.schedule[day];
                    return(
                        <div key={`display_${section.id}_${day}`} className={style.display_daily_block}>
                            <h4>{day}</h4>
                            {Object.keys(dailySchedule).sort((a, b) => a - b).map((sequence, i) => {
                                const timeBlock = dailySchedule[sequence]
                                return (
                                    <div key={`display_${section.id}_${day}_${i}`} className={style.display_time}>{`${timeToString(timeBlock.start.hour, timeBlock.start.minute)} - ${timeToString(timeBlock.end.hour, timeBlock.end.minute)}`}</div>
                                )})
                            }
                        </div>
                    )
                })}
            <button onClick={()=>setEditSections([...editSections, section.id])} className={style.edit_section_button}>{"Edit Section"}</button>
            </div>
        </React.Fragment>
    )
}

function timeToString(hourInt, minuteInt) {
    let isPM = false
    if (hourInt > 12) {
        hourInt -= 12
        isPM = true;
    }
    if (hourInt === 0) {
        hourInt = 12
    }
    const minute = minuteInt % 10 === minuteInt ? "0" + minuteInt : minuteInt

    if (isPM) return `${hourInt}:${minute} PM`
    return `${hourInt}:${minute} AM`
}

export default DisplaySection;
