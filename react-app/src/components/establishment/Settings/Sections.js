import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import style from './Settings.module.css'

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

    return(
        <div id={style.sections_page}>
            <form id={style.new_section_form}>
                <label htmlFor={"section_name"}>{"Section Name"}</label>
                <input onChange={e => setSectionName(e.target.value)} type={"text"} name={"section_name"} placeholder={"less than 40 characters"} value={sectionName}></input>
                <h2>{"Section Schedule"}</h2>
                {Object.keys(scheduleTemplate).map(day => {
                    const dailySchedule = scheduleTemplate[day];
                    return(
                        <div key={day} className={style.schedule_daily_block}>
                            <h3>{day}</h3>
                            {Object.keys(dailySchedule).sort((a, b) => a - b).map((sequence, i) => {
                                return (
                                    <React.Fragment key={`${day}_${sequence}`}>
                                        <label htmlFor={`${day}_${sequence}_start`}>{"Start"}</label>
                                        <input type={"time"} name={`${day}_${sequence}_start`} value={newSchedule[day][sequence].start}></input>
                                        <label htmlFor={`${day}_${sequence}_end`}>{"End"}</label>
                                        <input type={"time"} name={`${day}_${sequence}_end`} value={newSchedule[day][sequence].end}></input>
                                    </React.Fragment>
                                )})
                            }
                        </div>
                    )
                })}
                {newSectionForm && <button id={style.new_section_button}>{"Submit Section"}</button>}
            </form>
            {!newSectionForm && <button id={style.new_section_button}>{"New Section"}</button>}
        </div>
    )
}

export default Sections;
