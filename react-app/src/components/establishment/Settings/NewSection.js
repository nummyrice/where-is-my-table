import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import style from './Settings.module.css'
import { clearErrors, setErrors } from '../../../store/errors';
import { newSection } from '../../../store/establishment';
const scheduleTemplate = {
    monday: {
        1: {
            start: {
                hour: 8,
                minute: 0,
            },
            end: {
                hour: 20,
                minute: 0
            },
            valid: true
        }
    },
    tuesday: {
         1: {
            start: {
                hour: 8,
                minute: 0,
            },
            end: {
                hour: 20,
                minute: 0
            },
            valid: true
        }
    },
    wednesday: {
         1: {
            start: {
                hour: 8,
                minute: 0,
            },
            end: {
                hour: 20,
                minute: 0
            },
            valid: true
        }
    },
    thursday: {
         1: {
            start: {
                hour: 8,
                minute: 0,
            },
            end: {
                hour: 20,
                minute: 0
            },
            valid: true
        }
    },
    friday: {
         1: {
            start: {
                hour: 8,
                minute: 0,
            },
            end: {
                hour: 20,
                minute: 0
            },
            valid: true
        }
    },
    saturday: {
         1: {
            start: {
                hour: 8,
                minute: 0,
            },
            end: {
                hour: 20,
                minute: 0
            },
            valid: true
        }
    },
    sunday: {
         1: {
            start: {
                hour: 8,
                minute: 0,
            },
            end: {
                hour: 20,
                minute: 0
            },
            valid: true
        }
    }
}

const NewSection = ({setNewSectionForm, setShowErrorsModal}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const [sectionName, setSectionName] = useState('')
    const [newSchedule, setNewSchedule] = useState(scheduleTemplate)

    const timeChangeHandler = (event, day, sequence, bound) => {
        const newTime = event.target.value
        if (newTime) {
            const hour = parseInt(newTime[0], 10) * 10 + parseInt(newTime[1], 10)
            const minute = parseInt(newTime[3], 10) * 10 + parseInt(newTime[4], 10)
            const updatedNewSchedule = {...newSchedule, [day]: {...newSchedule[day], [sequence]: {...newSchedule[day][sequence], [bound]: {hour, minute}}}}
            setNewSchedule(updatedNewSchedule)
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
        setNewSchedule({...currSchedule, [day]: {...currSchedule[day], [latestSequence+1]:{start: {hour: 0, minute: 0}, end: {hour: 0, minute: 0}}}}, )
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
        return setNewSchedule(scheduleCopy)
    }
    const validateTime = (day, sequence) => {
        const validScheduleCopy = {...newSchedule, [day]: {...newSchedule[day], [sequence]: {...newSchedule[day][sequence], valid: true} }}
        const invalidScheduleCopy = {...newSchedule, [day]: {...newSchedule[day], [sequence]: {...newSchedule[day][sequence], valid: false} }}
        const startHour = newSchedule[day][sequence].start.hour
        const startMinute = newSchedule[day][sequence].start.minute
        const endHour = newSchedule[day][sequence].end.hour
        const endMinute = newSchedule[day][sequence].end.minute
        if (startHour === endHour && startMinute >= endMinute) {
            return setNewSchedule(invalidScheduleCopy)
        }
        if (startHour > endHour) return setNewSchedule(invalidScheduleCopy)
        if (parseInt(sequence, 10) === 1) return setNewSchedule(validScheduleCopy);
        const prevHour = newSchedule[day][parseInt(sequence, 10) - 1].end.hour
        const prevMinute = newSchedule[day][parseInt(sequence, 10) - 1].end.minute
        if (startHour === prevHour && startMinute <= prevMinute) return setNewSchedule(invalidScheduleCopy)
        if (startHour < prevHour) return setNewSchedule(invalidScheduleCopy)
        return setNewSchedule(validScheduleCopy)
    }

    const handleNewScheduleSubmit = (event) => {
        event.preventDefault()
        Object.keys(newSchedule).forEach(day => Object.keys(newSchedule[day]).forEach(sequence => {
            if (!newSchedule[day][sequence].valid) {
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
        dispatch(newSection(sectionName, newSchedule, user.establishment_id))
            .then(data => {
                if (data.errors) {
                    setShowErrorsModal(true)
                } else {
                    setNewSchedule(scheduleTemplate)
                    setSectionName('')
                    setNewSectionForm(false)
                }

            })
    }
    return(
        <form id={style.new_section_form}>
                <h3>{"Section Details"}</h3>
                <div id={style.new_section_details_block}>
                    <label id={style.new_section_name_label} htmlFor={"section_name"}>{"Section Name"}</label>
                    <input onChange={e => setSectionName(e.target.value)} type={"text"} name={"section_name"} placeholder={"less than 40 characters"} value={sectionName}></input>
                </div>
                <h3>{"Section Schedule"}</h3>
                {Object.keys(newSchedule).map(day => {
                    const dailySchedule = newSchedule[day];
                    return(
                        <div key={day} className={style.schedule_daily_block}>
                            <h4>{day}</h4>
                            {Object.keys(dailySchedule).sort((a, b) => a - b).map((sequence, i) => {
                                return (
                                    <React.Fragment key={`${day}_${sequence}`}>
                                        <label htmlFor={`${day}_${sequence}_start`}>{"Start"}</label>
                                        <input onBlur={() => validateTime(day, sequence)} onChange={event => timeChangeHandler(event, day, sequence, "start")} step={900} className={`${style.start_time_input} ${dailySchedule[sequence].valid ? null : style.time_block_error}`} type={"time"} name={`${day}_${sequence}_start`} value={timeValueSetter(newSchedule[day][sequence].start.hour, newSchedule[day][sequence].start.minute)}></input>
                                        <label htmlFor={`${day}_${sequence}_end`}>{"End"}</label>
                                        <input onBlur={() => validateTime(day, sequence)} onChange={event => timeChangeHandler(event, day, sequence, "end")} step={900} className={`${style.end_time_input} ${dailySchedule[sequence].valid ? null : style.time_block_error}`} type={"time"} name={`${day}_${sequence}_end`} value={timeValueSetter(newSchedule[day][sequence].end.hour, newSchedule[day][sequence].end.minute)}></input>
                                        <button className={style.remove_time_block} onClick={(event) => removeTimeBlock(event, newSchedule, day, sequence)}>{"-"}</button>
                                    </React.Fragment>
                                )})
                            }
                            {Object.keys(dailySchedule).length < 5 && <button className={style.add_time_block} onClick={(event) => addTimeBlock(event, newSchedule, day)}>{"+"}</button>}
                        </div>
                    )
                })}
                <div id={style.new_section_button_block}>
                    <button onClick={()=>{setNewSectionForm(false);setNewSchedule(scheduleTemplate)}}id={style.new_section_cancel_button}>{"Cancel"}</button>
                    <button onClick={(event) => handleNewScheduleSubmit(event)} id={style.new_section_submit_button}>{"Submit Section"}</button>
                 </div>
            </form>
    )
}

function timeValueSetter(hourInt, minuteInt) {
    const hour = hourInt % 10 === hourInt ? "0" + hourInt : hourInt;
    const minute = minuteInt % 10 === minuteInt ? "0" + minuteInt : minuteInt
    return `${hour}:${minute}`
}

export default NewSection
