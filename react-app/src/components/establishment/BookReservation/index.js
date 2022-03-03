import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { EstablishmentContext } from '..';
import style from './BookReservation.module.css';
import AddGuest from '../AddGuest';
import {ReactComponent as X} from '../AddReservation/assets/times-solid.svg'
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
function BookReservation({setBookings}) {
    const { selectedDate } = useContext(EstablishmentContext);
    const [partySize, setPartySize] = useState(1)
    const [selectedBookDate, setSelectedBookDate] = useState(selectedDate)
    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0)
    const establishment = useSelector(state => state.session.user.establishment)
    const timezoneOffset = establishment.timezone_offset
    const todaysScheduleBySection = {}
    const weekday = selectedBookDate.toLocaleDateString('en-US',{weekday: 'long'}).toLowerCase();
    for (const id in establishment.sections) {
        if (weekday in establishment.sections[id].schedule) {
            todaysScheduleBySection[id] = establishment.sections[id].schedule[weekday]
        }
    }
    // console.log('weekday: ', todaysScheduleBySection)
    const dates = Array(30).fill(0).map((_, day) => {
        const selectedDateCopy = new Date(selectedDate)
        selectedDateCopy.setDate(selectedDate.getDate() + day)
        return selectedDateCopy;
    })

    const party = Array(30).fill(0).map((_, num) => {
        return num + 1;
    })
    let date = new Date(selectedBookDate)
    // TODO: math.abs should not be used here. Test different est. time zones and determine how offset should work through the app
    // TODO: add time for each table
    // TODO: add max capacity to establishment for each 15 minute period
    date.setUTCHours(Math.abs(timezoneOffset), 0, 0, 0)
    const times = Array(96).fill(0).map((_, minutesMultiplier) => {
        const timeIncrement = new Date(date)
        timeIncrement.setMinutes(15 * minutesMultiplier)
        return timeIncrement;
    })
     const availableTimes = times.filter(time => {
        for (let id in todaysScheduleBySection) {
            for (let block in todaysScheduleBySection[id]) {
                const selectedBookDateStart = new Date(selectedBookDate)
                selectedBookDateStart.setUTCHours(Math.abs(timezoneOffset), 0, 0, 0)
                const selectedBookDateEnd = new Date(selectedBookDate)
                selectedBookDateEnd.setUTCHours(Math.abs(timezoneOffset), 0, 0, 0)
                const start = selectedBookDateStart.setHours(selectedBookDateStart.getHours() + todaysScheduleBySection[id][block].start.hour, selectedBookDateStart.getMinutes() + todaysScheduleBySection[id][block].start.minute)
                const end = selectedBookDateEnd.setHours(selectedBookDateEnd.getHours() + todaysScheduleBySection[id][block].end.hour, selectedBookDateEnd.getMinutes() + todaysScheduleBySection[id][block].end.minute)
                if (time > start && time < end) {
                    return true;
                }
            }
        }
        return false;
    })
    // TODO: get reservations when a given date is selected
    const reservations = [ {
        id: 1,
        reservation_time: new Date().toISOString()
    }]
    // get sections available at selected time
    // get number of tables that are not taken
        // declare table counter
        // look at reservations that are within two hours from the selected time
        // for each reservation subtract from the total available
    const availableSections = [];
    if (availableTimes[selectedTimeIndex]) {
        for (let id in todaysScheduleBySection) {
            for (let block in todaysScheduleBySection[id]) {
                const selectedBookDateStart = new Date(selectedBookDate)
                selectedBookDateStart.setUTCHours(Math.abs(timezoneOffset), 0, 0, 0)
                const selectedBookDateEnd = new Date(selectedBookDate)
                selectedBookDateEnd.setUTCHours(Math.abs(timezoneOffset), 0, 0, 0)
                const start = selectedBookDateStart.setHours(selectedBookDateStart.getHours() + todaysScheduleBySection[id][block].start.hour, selectedBookDateStart.getMinutes() + todaysScheduleBySection[id][block].start.minute)
                const end = selectedBookDateEnd.setHours(selectedBookDateEnd.getHours() + todaysScheduleBySection[id][block].end.hour, selectedBookDateEnd.getMinutes() + todaysScheduleBySection[id][block].end.minute)
                if (availableTimes[selectedTimeIndex] > start && availableTimes[selectedTimeIndex] < end) {
                    let tableTotal = Object.keys(establishment.sections[id].tables).length
                    reservations.forEach((res) => {
                        const reservationTime = new Date(res.reservation_time)
                        const timeDiff =  Math.abs(reservationTime.getTime() - availableTimes[selectedTimeIndex].getTime()) / 60000
                        if (timeDiff < 120) {
                            tableTotal--;
                        }
                    })
                    if (tableTotal) {
                        const section = {
                            id: id,
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
return(
    <div id={style.book_background}>
        <div id={style.modal}>
            <div className={style.title}>Book a Reservation</div>
            <X onClick={() => {setBookings(null)}} className={style.icon}/>
            <div className={style.date}>
                <div className={style.top_scroll_space}></div>
                {dates.map((date) => {
                    const dateText = date.toLocaleDateString('en-US', {timeZone: 'America/New_York', month: 'short', day: 'numeric'});
                    const weekday = date.toLocaleDateString('en-US', {timeZone: 'America/New_York', weekday: 'short'});
                    const weekdayChar = weekday.slice(0,1);
                    return (
                        <div onClick={() => {}} key={date.toISOString()} className={style.date_cell}>
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
                <div className={style.top_scroll_space}></div>
                {availableTimes.map(time => {
                    const localTimeString = time.toLocaleTimeString('en-Us', {timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
                    let capacity = 0;
                    reservations.forEach((res) => {
                        const reservationTime = new Date(res.reservation_time)
                        const timeDiff =  Math.abs(reservationTime.getTime() - time.getTime()) / 60000
                        if (timeDiff < 120) {
                            capacity++;
                        }
                    })
                    return(
                        <div onClick={() =>{
                        }} key={time.toISOString()}className={style.time_cell}>
                            <div className={style.time_text}>{localTimeString}</div>
                            <div className={style.capacity}>{`${capacity}/20`}</div>
                        </div>
                    )
                })}
                <div className={style.bottom_scroll_space}></div>
            </div>
            <div className={style.section}>
                <div className={style.top_scroll_space}></div>
                {availableSections.map((section => {
                    return (
                        <div key={section.id} className={style.section_cell}>
                            <div className={style.section_name}>{section.name}</div>
                            <div className={style.section_tables}>{`${section.availableTables} available`}</div>
                        </div>
                    )
                }))}
                <div className={style.section_cell}>Unassigned Table</div>
                <div className={style.bottom_scroll_space}></div>
            </div>
            <AddGuest></AddGuest>
        </div>
    </div>
)
}

export default BookReservation
