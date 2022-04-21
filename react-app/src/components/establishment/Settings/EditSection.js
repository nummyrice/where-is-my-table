import React, { useState } from 'react';
import { setErrors } from '../../../store/errors';
import { useDispatch } from 'react-redux';
import style from './Settings.module.css'
import { editSection } from '../../../store/establishment'

const EditSection = ({section, setEditSections, editSections, setShowErrorsModal}) => {
    const dispatch = useDispatch()
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

    const addTimeBlock = (event, currSchedule, day) => {
        event.preventDefault()
        const dailySchedule = currSchedule[day]
        let latestSequence = 0;
        for (let sequence in dailySchedule) {
            const sequenceInt = parseInt(sequence, 10)
            if (latestSequence < sequence) latestSequence = sequenceInt
        }
        setEditSectionSchedule({...currSchedule, [day]: {...currSchedule[day], [latestSequence+1]:{start: {hour: 0, minute: 0}, end: {hour: 0, minute: 0}}}}, )
    }

    const removeTimeBlock = (event, currSchedule, day, sequence) => {
        event.preventDefault()
        const scheduleCopy = {...currSchedule, [day]: {...currSchedule[day]}}
        delete scheduleCopy[day][sequence]
        let index = parseInt(sequence, 10);
        while (index <= 5) {
            if (!scheduleCopy[day][index + 1]) {
                delete scheduleCopy[day][index]
                break
            }
            scheduleCopy[day][index] = scheduleCopy[day][index + 1]
            index++
        }
        return setEditSectionSchedule(scheduleCopy)
    }

    const validateTime = (day, sequence) => {
        const validScheduleCopy = {...editSectionSchedule, [day]: {...editSectionSchedule[day], [sequence]: {...editSectionSchedule[day][sequence], valid: true} }}
        const invalidScheduleCopy = {...editSectionSchedule, [day]: {...editSectionSchedule[day], [sequence]: {...editSectionSchedule[day][sequence], valid: false} }}
        const startHour = editSectionSchedule[day][sequence].start.hour
        const startMinute = editSectionSchedule[day][sequence].start.minute
        const endHour = editSectionSchedule[day][sequence].end.hour
        const endMinute = editSectionSchedule[day][sequence].end.minute
        if (startHour === endHour && startMinute >= endMinute) {
            return setEditSectionSchedule(invalidScheduleCopy)
        }
        if (startHour > endHour) return setEditSectionSchedule(invalidScheduleCopy)
        if (parseInt(sequence, 10) === 1) return setEditSectionSchedule(validScheduleCopy);
        const prevHour = editSectionSchedule[day][parseInt(sequence, 10) - 1].end.hour
        const prevMinute = editSectionSchedule[day][parseInt(sequence, 10) - 1].end.minute
        if (startHour === prevHour && startMinute <= prevMinute) return setEditSectionSchedule(invalidScheduleCopy)
        if (startHour < prevHour) return setEditSectionSchedule(invalidScheduleCopy)
        return setEditSectionSchedule(validScheduleCopy)
    }

    const handleSectionUpdate = (event) => {
        event.preventDefault()
        Object.keys(editSectionSchedule).forEach(day => Object.keys(editSectionSchedule[day]).forEach(sequence => {
            if (!editSectionSchedule[day][sequence].valid) {
                setErrors(["time-block: one or more of the time blocks specified are overlapping, or not in sequential order"])
                setShowErrorsModal(true)
                return
            }
        }))
        if (sectionName.length > 40) {
            setErrors(["sectionName: must not exceed 40 characters"])
            setShowErrorsModal(true)
            return
        }

        dispatch(editSection(section.id, sectionName, editSectionSchedule))
            .then(data => {
                if (data.errors) {
                    setShowErrorsModal(true)
                } else {
                    setEditSections(editSections.filter(id => id !== section.id))
                }

            })
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
                {Object.keys(editSectionSchedule).map(day => {
                    const dailySchedule = editSectionSchedule[day];
                    return(
                        <div key={day} className={style.schedule_daily_block}>
                            <h4>{day}</h4>
                            {Object.keys(dailySchedule).sort((a, b) => a - b).map((sequence, i) => {
                                return (
                                    <React.Fragment key={`${day}_${sequence}`}>
                                        <label htmlFor={`${day}_${sequence}_start`}>{"Start"}</label>
                                        <input onBlur={() => validateTime(day, sequence)} onChange={event => timeChangeHandler(event, day, sequence, "start")} step={900} className={`${style.start_time_input} ${dailySchedule[sequence].valid ? null : style.time_block_error}`} type={"time"} name={`${day}_${sequence}_start`} value={timeValueSetter(editSectionSchedule[day][sequence].start.hour, editSectionSchedule[day][sequence].start.minute)}></input>
                                        <label htmlFor={`${day}_${sequence}_end`}>{"End"}</label>
                                        <input onBlur={() => validateTime(day, sequence)} onChange={event => timeChangeHandler(event, day, sequence, "end")} step={900} className={`${style.end_time_input} ${dailySchedule[sequence].valid ? null : style.time_block_error}`} type={"time"} name={`${day}_${sequence}_end`} value={timeValueSetter(editSectionSchedule[day][sequence].end.hour, editSectionSchedule[day][sequence].end.minute)}></input>
                                        <button className={style.remove_time_block} onClick={(event) => removeTimeBlock(event, editSectionSchedule, day, sequence)}>{"-"}</button>
                                    </React.Fragment>
                                )})
                            }
                            {Object.keys(dailySchedule).length < 5 && <button className={style.add_time_block} onClick={(event) => addTimeBlock(event, editSectionSchedule, day)}>{"+"}</button>}
                        </div>
                    )
                })}
                <div id={style.new_section_button_block}>
                    <button onClick={()=>setEditSections(editSections.filter(id => id !== section.id))} id={style.new_section_cancel_button}>{"Cancel"}</button>
                    <button onClick={(event) => handleSectionUpdate(event)} id={style.new_section_submit_button}>{"Update Section"}</button>
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
