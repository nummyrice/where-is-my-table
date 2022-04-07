import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import style from './Settings.module.css'
import DisplaySection from './DisplaySection';
import EditSection from './EditSection';

const Sections = () => {
    const scheduleTemplate = {
        monday: {
            1: {
                start: {
                    hour: 0,
                    minute: 0,
                },
                end: {
                    hour: 0,
                    minute: 0
                }
            }
        },
        tuesday: {
             1: {
                start: {
                    hour: 0,
                    minute: 0,
                },
                end: {
                    hour: 0,
                    minute: 0
                }
            }
        },
        wednesday: {
             1: {
                start: {
                    hour: 0,
                    minute: 0,
                },
                end: {
                    hour: 0,
                    minute: 0
                }
            }
        },
        thursday: {
             1: {
                start: {
                    hour: 0,
                    minute: 0,
                },
                end: {
                    hour: 0,
                    minute: 0
                }
            }
        },
        friday: {
             1: {
                start: {
                    hour: 0,
                    minute: 0,
                },
                end: {
                    hour: 0,
                    minute: 0
                }
            }
        },
        saturday: {
             1: {
                start: {
                    hour: 0,
                    minute: 0,
                },
                end: {
                    hour: 0,
                    minute: 0
                }
            }
        },
        sunday: {
             1: {
                start: {
                    hour: 0,
                    minute: 0,
                },
                end: {
                    hour: 0,
                    minute: 0
                }
            }
        }
    }
    const user = useSelector(state => state.session.user)
    const [newSectionForm, setNewSectionForm] = useState(false)
    const [sectionName, setSectionName] = useState('')
    const [newSchedule, setNewSchedule] = useState(scheduleTemplate)
    const [editSections, setEditSections] = useState([])

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
        setNewSchedule(scheduleCopy)
    }
    const validateTime = (target, day, sequence, bound) => {
        const hour = newSchedule[day][sequence][bound].hour
        const minute = newSchedule[day][sequence][bound].minute
        const pairedHour = bound === 'start' ? newSchedule[day][sequence].end.hour : newSchedule[day][sequence].start.hour
        const pairedMinute = bound === 'start' ? newSchedule[day][sequence].end.minute : newSchedule[day][sequence].start.minute
        const prevHour = newSchedule[day][parseInt(sequence, 10) - 1].end.hour
        const prevMinute = newSchedule[day][parseInt(sequence, 10) - 1].end.minute
        console.log("validate time log: ", hour, minute)
        console.log("validate prev log: ", prevHour, prevMinute)
        // if start
            // if end is less than start
                // return error
        // if end
            // if start is greater than end
                // return error

        if (bound === "start") {
            if (hour === pairedHour && minute >= pairedMinute) {

            }
        }

        if (parseInt(sequence, 10) === 1) return;
        if (hour === prevHour && minute <= prevMinute) {
            target.style.borderColor = "red"
            alert("1 Time blocks must be in sequence and must not overlap.")
            return
        }
        if (hour < prevHour) {
            target.style.borderColor = "red"
            alert("2 Time blocks must be in sequence and must not overlap.")
            return
        }
       target.style.borderColor = "green"
    }
    // check that no start time comes before any other end time for the day
    // const validateSchedule = (schedule) => {
    //     const errors = []
    //     const days = Object.keys(newSchedule)
    //     const forEach
    // }
    // get current establishment sections
        // create display/edit section form/component
    // map through each section
        // pass section schedule and details to section display/edit component
        //
    return(
        <div id={style.sections_page}>
            {newSectionForm && <form id={style.new_section_form}>
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
                                        <input onBlur={(event) => validateTime(event.target, day, sequence, "start")} onChange={event => timeChangeHandler(event, day, sequence, "start")} step={900} className={style.start_time_input} type={"time"} name={`${day}_${sequence}_start`} value={timeValueSetter(newSchedule[day][sequence].start.hour, newSchedule[day][sequence].start.minute)}></input>
                                        <label htmlFor={`${day}_${sequence}_end`}>{"End"}</label>
                                        <input onBlur={(event) => validateTime(event.target, day, sequence, "end")} onChange={event => timeChangeHandler(event, day, sequence, "end")} step={900} type={"time"} name={`${day}_${sequence}_end`} value={timeValueSetter(newSchedule[day][sequence].end.hour, newSchedule[day][sequence].end.minute)}></input>
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
                    <button id={style.new_section_submit_button}>{"Submit Section"}</button>
                 </div>
            </form>}
            {!newSectionForm && <button onClick={() => setNewSectionForm(true)} id={style.new_section_button}>{"New Section"}</button>}
            {user.establishment?.sections && Object.keys(user.establishment.sections).map(sectionId => {
                const section = user.establishment.sections[sectionId]
                return(
                    <React.Fragment key={sectionId}>
                        {!editSections.find(id => id === section.id) && <DisplaySection section={section} editSections={editSections} setEditSections={setEditSections}/>}
                        {editSections.find(id => id === section.id) && <EditSection section={section} editSections={editSections} setEditSections={setEditSections}/>}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

function timeValueSetter(hourInt, minuteInt) {
    const hour = hourInt % 10 === hourInt ? "0" + hourInt : hourInt;
    const minute = minuteInt % 10 === minuteInt ? "0" + minuteInt : minuteInt
    return `${hour}:${minute}`
}

export default Sections;
