import React, {useEffect, useState} from 'react';
import style from "./ResSchedule.module.css";

const ResSchedule =() => {
    const [availableTimes, setAvailableTimes] = useState();
    const [reservations, setReservations] = useState();

    // FETCH RESERVATIONS AND AVAILABLE TIMES
    useEffect(() => {
        // todo: startDate must be the date set by the calender component and must be prop threaded to this point
        const startDate = new Date('December 27, 2021 08:00:00')
        fetch('/api/reservations', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"client_date": startDate.toISOString()})
        }).then(async (response) => {
            const data = await response.json()
            setAvailableTimes(data.available_times)
            setReservations(data.todays_res)
        }).catch((e) => {
            console.error(e)
        })
    },[])

    // console.log('AVAILABLE TIMES AND RESERVATIONS OBJECTS: ', availableTimes, reservations)

    // SET 24 TEMPLATE COLUMNS
    const hourColumns = Array(24).fill(0).map((_, hour) => {
        const date = new Date()
        date.setHours(hour, 0, 0, 0)
        return date
    })

    // SET 24 SCHEDULE MODEL
    const resScheduleModel = hourColumns.map((datetime, index) => {
        const scheduleColumn = {
            timeMarker: datetime,
            reservations: reservations?.filter((reservation) => {
                return reservation > datetime && reservation < hourColumns[index + 1]
            }),
            availableTimes: availableTimes?.filter((timeslotObj, index) => {
                return timeslotObj.datetime > datetime && timeslotObj.datetime < hourColumns[index + 1]
            })
        }
        return(
            scheduleColumn
        )
    })

    console.log('MODEL ARRAY: ', resScheduleModel);

    return(
        <div className={style.res_schedule}>
            <div className={style.time_scroll}></div>
                {}
            <div className={style.schedule_scroll}></div>
            <div className={style.footer_options}></div>
        </div>
    )
}

export default ResSchedule;
