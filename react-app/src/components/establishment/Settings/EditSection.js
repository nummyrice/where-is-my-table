import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
import style from './Settings.module.css'

const EditSection = ({section, setEditSections, editSections}) => {
    const [editSectionSchedule, setEditSectionSchedule] = useState(section.schedule)
    const [sectionName, setSectionName] = useState(section.name)

    const timeChangeHandler = (event, day, sequence, bound) => {
        const newTime = event.target.value
        if (newTime) {
            const hour = parseInt(newTime[0], 10) * 10 + parseInt(newTime[1], 10)
            const minute = parseInt(newTime[3], 10) * 10 + parseInt(newTime[4], 10)
            const updatedSchedule = {...editSectionSchedule, [day]: {...editSectionSchedule[day], [sequence]: {...editSectionSchedule[day][sequence], [bound]: {hour, minute}}}}
            setEditSectionSchedule(updatedSchedule)
        }
    }

    return(
        <React.Fragment key={section.id}>
            <h2>{section.name}</h2>
            <form id={style.new_section_form}>
                <h3>{"Section Details"}</h3>
                {<div id={style.new_section_details_block}>
                    <label id={style.new_section_name_label} htmlFor={"section_name"}>{"Section Name"}</label>
                    <input onChange={e => setSectionName(e.target.value)} type={"text"} name={"section_name"} placeholder={"less than 40 characters"} value={sectionName}></input>
                </div>}
                <h3>{"Section Schedule"}</h3>
                {Object.keys(section.schedule).map(day => {
                    const dailySchedule = section.schedule[day];
                    return(
                        <div key={day} className={style.schedule_daily_block}>
                            <h4>{day}</h4>
                            {Object.keys(dailySchedule).sort((a, b) => a - b).map((sequence, i) => {
                                return (
                                    <React.Fragment key={`${day}_${sequence}`}>
                                        <label htmlFor={`${day}_${sequence}_start`}>{"Start"}</label>
                                        <input onChange={event => timeChangeHandler(event, day, sequence, "start")} step={900} className={style.start_time_input} type={"time"} name={`${day}_${sequence}_start`} value={timeValueSetter(editSectionSchedule[day][sequence].start.hour, editSectionSchedule[day][sequence].start.minute)}></input>
                                        <label htmlFor={`${day}_${sequence}_end`}>{"End"}</label>
                                        <input onChange={event => timeChangeHandler(event, day, sequence, "end")} step={900} type={"time"} name={`${day}_${sequence}_end`} value={timeValueSetter(editSectionSchedule[day][sequence].end.hour, editSectionSchedule[day][sequence].end.minute)}></input>
                                    </React.Fragment>
                                )})
                            }
                        </div>
                    )
                })}
                <div id={style.new_section_button_block}>
                    <button onClick={()=>setEditSections(editSections.filter(id => id !== section.id))} id={style.new_section_cancel_button}>{"Cancel"}</button>
                    <button id={style.new_section_submit_button}>{"Submit Section"}</button>
                 </div>
            </form>
        </React.Fragment>
    )
}

function timeValueSetter(hourInt, minuteInt) {
    const hour = hourInt % 10 === hourInt ? "0" + hourInt : hourInt;
    const minute = minuteInt % 10 === minuteInt ? "0" + minuteInt : minuteInt
    return `${hour}:${minute}`
}

export default EditSection;
