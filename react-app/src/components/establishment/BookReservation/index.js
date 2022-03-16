import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EstablishmentContext } from '..';
import style from './BookReservation.module.css';
import AddGuest from '../AddGuest';
import {ReactComponent as X} from '../AddReservation/assets/times-solid.svg'
import { getReservations } from '../../../store/reservations';
import { Modal } from '../../../context/Modal';
import ConfirmResModal from '../AddGuest/ConfirmResModal';
import { newReservation, updateReservation } from '../../../store/reservations';
import DisplayErrors from '../DisplayErrors';
import { clearErrors } from '../../../store/errors'
import { DateTime } from 'luxon'
// create data model for calendar (next 30 days including selected date)
    // [date1, date2, date3, date4]
    // create data model for guest number
    // [1, 2, 3, 4, 5, 6, ...]
    // create time model based off of sections and their open times
    // available_time: [{
    //     time: "1:30am",
    //     available_sections: [section_id, section_id]
    // }]
    // reservations: [res1, res2, res3]
        // for each time determine the number of individuals reserved for tables at that time (2 hour window)
        // the sections should be listed for each time slot with the number of tables available for that time slot based on the guest count selected
    /* {
        array [
            {
                time: 1:45pm
                sections: [{
                    section_id: 1,
                    available_tables: 4
                }]
            }
        ]
    }*/

    //
function BookReservation({bookRes, setBookRes}) {
    const dispatch = useDispatch()
    const { selectedDate, setSelectedDate } = useContext(EstablishmentContext);
    console.log("bookres: ", bookRes)
    let editDate
    if (bookRes !== "new") {
        editDate = DateTime.fromISO(bookRes.reservation_time).startOf('day')
    }
    const [isLoading, setIsLoading] = useState(false)
    const [partySize, setPartySize] = useState(1)
    const [selectedBookDate, setSelectedBookDate] = useState(bookRes === 'new' ? selectedDate : editDate)
    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0)
    const [selectedSection, setSelectedSection] = useState(bookRes === 'new' ? null : bookRes.section)
    const [selectedGuest, setSelectedGuest] = useState(bookRes === 'new' ? null : bookRes.guest_info)
    const [showConfirmRes, setShowConfirmRes] = useState(false)
    const [showErrorsModal, setShowErrorsModal] = useState(false)
    // const [errors, setErrors] = useState([]);
    useEffect(() => {
        setIsLoading(true)
        dispatch(getReservations(selectedBookDate.toISO()))
        .then(async result => {
            console.log("successfully acquired reservations")
        }).catch(err => {
            console.log("failed to acquire reservations")
        }).finally(() => {
            setIsLoading(false);
        })
    }, [dispatch, selectedBookDate])
    const establishment = useSelector(state => state.session.user.establishment)
    const reservations = useSelector(state => state.reservations)
    const errors = useSelector(state => state.errors)
    const todaysScheduleBySection = useMemo(() => {
        const todaysScheduleBySection = {}
        const weekday = selectedBookDate.toLocaleString({ weekday: 'long'}).toLowerCase();
        for (const id in establishment.sections) {
            if (weekday in establishment.sections[id].schedule) {
                todaysScheduleBySection[id] = establishment.sections[id].schedule[weekday]
            }
        }
        return todaysScheduleBySection;
    }, [establishment.sections, selectedBookDate])
    // console.log('weekday: ', todaysScheduleBySection)
    const dates = Array(30).fill(0).map((_, day) => {
        return selectedDate.plus({day: day});
    })

    const party = Array(30).fill(0).map((_, num) => {
        return num + 1;
    })
    const availableTimes = useMemo(() => {
        const times = Array(96).fill(0).map((_, minutesMultiplier) => {
            return selectedBookDate.plus({minute:15 * minutesMultiplier});
        })
        return (times.filter(time => {
            for (let id in todaysScheduleBySection) {
                for (let block in todaysScheduleBySection[id]) {
                    const start = selectedBookDate.set({hour: todaysScheduleBySection[id][block].start.hour, minute: todaysScheduleBySection[id][block].start.minute})
                    const end = selectedBookDate.set({hour: todaysScheduleBySection[id][block].end.hour, minute: todaysScheduleBySection[id][block].end.minute})
                    if (time > start && time < end) {
                        return true;
                    }
                }
            }
            return false;
        }))
    }, [selectedBookDate, todaysScheduleBySection])
    // get sections available at selected time
    // get number of tables that are not taken
        // declare table counter
        // look at reservations that are within two hours from the selected time
        // for each reservation subtract from the total available
    const availableSections = useMemo(() => {
        const availableSections = [];
        if (availableTimes[selectedTimeIndex]) {
            for (let id in todaysScheduleBySection) {
                for (let block in todaysScheduleBySection[id]) {
                    const start = selectedBookDate.set({hour: todaysScheduleBySection[id][block].start.hour, minute: todaysScheduleBySection[id][block].start.minute})
                    const end = selectedBookDate.set({hour: todaysScheduleBySection[id][block].end.hour, minute: todaysScheduleBySection[id][block].end.minute})
                    if (availableTimes[selectedTimeIndex] > start && availableTimes[selectedTimeIndex] < end) {
                        let tableTotal = Object.keys(establishment.sections[id].tables).length
                        const resIds = Object.keys(reservations)
                        resIds.forEach((id) => {
                            const res = reservations[id]
                            const reservationTime = DateTime.fromISO(res.reservation_time)
                            const timeDiff =  reservationTime.diff(availableTimes[selectedTimeIndex], 'minutes').toObject().minutes
                            if (res.section === parseInt(id, 10) &&  timeDiff < 120) {
                                tableTotal--;
                            }
                        })
                        if (tableTotal) {
                            const section = {
                                id: parseInt(id, 10),
                                name: establishment.sections[id].name,
                                availableTables: tableTotal,

                            };
                            availableSections.push(section)
                            break;
                        }
                    }
                }
            }
        }
        return availableSections;
    }, [availableTimes, establishment.sections, reservations, selectedBookDate, selectedTimeIndex, todaysScheduleBySection])

    function handleDateChange(dateString) {
        setIsLoading(true)
        dispatch(getReservations(selectedBookDate.toISO()))
        .then(async result => {
            console.log("successfully acquired reservations")
            setSelectedBookDate(DateTime.fromISO(dateString))
        }).catch(err => {
            console.log("failed to acquire reservations")
        }).finally(() => {
            setIsLoading(false);
        })
    }

    // const validateDate = () => {
    //     if (reservationDetails.setShowMakeRes) {
    //         const errors = [];
    //         if (reservationDetails.reservation_time.getTime() < new Date().getTime()) errors.push("reservation time has already passed, please adjust your date and/or time")
    //         return errors;
    //     }
    //     return [];
    // }

        // NEW RESERVATION
    const handleNewResSubmit = async () => {
        // if guest is selected but none of the edits are present
        dispatch(newReservation({guest_id: selectedGuest.id, reservation_time: availableTimes[selectedTimeIndex], party_size: partySize, section_id: selectedSection, table_id: null}))
            .then((data) => {
                if (data.errors) {
                    setShowConfirmRes(false)
                    setShowErrorsModal(true)
                } else {
                    setShowConfirmRes(false)
                    setBookRes(null)
                    setSelectedDate(DateTime.fromISO(data.reservation_time).startOf('day'))
                    return data;
                }
            })
    }

            // UPDATE RESERVATION
    const handleResUpdate = async () => {
        // if guest is selected but none of the edits are present
        dispatch(updateReservation({reservation_id: bookRes.id, guest_id: selectedGuest.id, reservation_time: availableTimes[selectedTimeIndex], party_size: partySize, section_id: selectedSection, table_id: null}))
            .then((data) => {
                if (data.errors) {
                    setShowConfirmRes(false)
                    setShowErrorsModal(true)
                } else {
                    setShowConfirmRes(false)
                    setBookRes(null)
                    setSelectedDate(DateTime.fromISO(data.reservation_time).startOf('day'))
                    return data;
                }
            })

    }

    const errorClose = () => {
        setShowErrorsModal(false)
        dispatch(clearErrors())
    }
return(
    <>
        <div id={style.modal}>
            <div className={style.title}>Book a Reservation</div>
            <X onClick={() => {setBookRes(null)}} className={style.icon}/>
            <div className={style.date}>
                <div className={style.top_scroll_space}></div>
                {dates.map((date) => {
                    const dateText = date.toLocaleString({month: 'short', day: 'numeric'});
                    const weekday = date.toLocaleString({weekday: 'short'});
                    const weekdayChar = weekday.slice(0,1);
                    return (
                        <div onClick={() => handleDateChange(date.toISO())} key={date.toISO()} className={`${style.date_cell} ${selectedBookDate.toISO() === date.toISO() ? style.selected : style.null}`}>
                            <div className={style.weekday}>{weekdayChar}</div>
                            <div className={style.date_text}>{dateText}</div>
                        </div>
                    )
                })}
                <div className={style.bottom_scroll_space}></div>
            </div>
            <div className={style.party_size}>
                <div className={style.top_scroll_space}></div>
                {party.map(guestNum => {
                    return(
                        <div onClick={() => {
                                setPartySize(guestNum)
                            }} key={`party_${guestNum}`} className={partySize === guestNum ? style.party_cell_select : style.party_cell}>
                            <div className={style.guest_num}>{`${guestNum} ${guestNum === 1 ? 'Guest' : 'Guests'}`}</div>
                       </div>
                        )
                    })}
                <div className={style.bottom_scroll_space}></div>
            </div>
            <div className={style.time}>
                <div className={`${style.top_scroll_space} ${isLoading ? style.is_loading : style.loaded} `}></div>
                {availableTimes.map((time, i) => {
                    const localTimeString = time.toLocaleString({hour: 'numeric', minute: '2-digit' });
                    let capacity = 0;
                    const resIds = Object.keys(reservations)
                    resIds.forEach((id) => {
                        const res = reservations[id]
                        console.log('res.section: ', typeof res.section)
                        console.log('selectedSection: ', typeof selectedSection)
                        if (res.section === selectedSection) {
                            const reservationTime = DateTime.fromISO(res.reservation_time)
                            const timeDiff =  reservationTime.diff(time, 'minutes').toObject().minutes
                            console.log('ISO: ', res.reservation_time)
                            console.log('time: ', reservationTime)
                            console.log('book reservation time diff: ', timeDiff)
                            if (timeDiff < 120) {
                                capacity+=res.party_size;
                            }
                        }
                    })
                    return(
                        <div onClick={() => setSelectedTimeIndex(i)} key={time.toISO()}className={`${style.time_cell} ${selectedTimeIndex === i ? style.selected : style.null} ${isLoading ? style.is_loading : style.loaded}`}>
                            <div className={style.time_text}>{localTimeString}</div>
                            <div className={style.capacity}>{`${capacity}/20`}</div>
                        </div>
                    )
                })}
                {isLoading && <div id={style.panel}>
                	<span id={style.loading5}>
                    <span id={style.outerCircle}></span>
               		</span>
                </div>}
                <div className={`${style.bottom_scroll_space} ${isLoading ? style.is_loading : style.loaded}`}></div>
                </div>
            <div className={style.section}>
                <div className={`${style.top_scroll_space} ${isLoading ? style.is_loading : style.loaded} `}></div>
                {availableSections.map((section => {
                    return (
                        <div key={section.id} className={`${style.section_cell} ${selectedSection === section.id ? style.selected : style.null} ${isLoading ? style.is_loading : style.loaded}`} onClick={() => setSelectedSection(section.id)}>
                            <div className={style.section_name}>{section.name}</div>
                            <div className={style.section_tables}>{`${section.availableTables} available`}</div>
                        </div>
                    )
                }))}
                {isLoading && <div id={style.panel}>
                	<span id={style.loading5}>
                    <span id={style.outerCircle}></span>
               		</span>
                </div>}
                <div className={`${style.section_cell} ${selectedSection ? style.null : style.selected} ${isLoading ? style.is_loading : style.loaded}`} onClick={() => setSelectedSection(null)}>Unassigned Table</div>
                <div className={`${style.bottom_scroll_space} ${isLoading ? style.is_loading : style.loaded}`}></div>
            </div>
            <AddGuest
                setSelectedGuest={setSelectedGuest}
                selectedGuest={selectedGuest}
                setShowConfirmRes={setShowConfirmRes}
                errors={errors}
                errorClose={errorClose}
                showErrorsModal={showErrorsModal}
                setShowErrorsModal={setShowErrorsModal}
            />
        </div>
        {showConfirmRes && (
            <Modal onClose={() => setShowConfirmRes(false)}>
                <ConfirmResModal
                    handleNewResSubmit={handleNewResSubmit}
                    handleResUpdate={handleResUpdate}
                    errors={errors}
                    errorClose={errorClose}
                    setShowConfirmRes={setShowConfirmRes}
                    bookRes={bookRes}
                    selectedSection={selectedSection}
                    resTime={availableTimes[selectedTimeIndex]}
                    partySize={partySize}
                    selectedGuest={selectedGuest}
                />
            </Modal>
        )}
        {showErrorsModal && (
            <Modal onClose={errorClose}>
                <DisplayErrors
                    errors={errors}
                    errorClose={errorClose}
                />
            </Modal>
        )}

    </>
)
}

export default BookReservation
