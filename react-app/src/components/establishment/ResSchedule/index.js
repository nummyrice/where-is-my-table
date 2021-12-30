import React, {useEffect, useState} from 'react';
import style from "./ResSchedule.module.css";
import { ReactComponent as UserIcon }from './assets/user-solid.svg'

const ResSchedule =({selectedDate}) => {
    const [availableTimes, setAvailableTimes] = useState();
    const [reservations, setReservations] = useState();

    // FETCH RESERVATIONS AND AVAILABLE TIMES
    useEffect(() => {
        // todo: startDate must be the date set by the calender component and must be prop threaded to this point
        // const startDate = new Date('December 28, 2021 08:00:00')
        // console.log("selected date in ResSchedule component: ", selectedDate)
        fetch('/api/reservations', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"client_date": selectedDate.toISOString()})
        }).then(async (response) => {
            const data = await response.json()
            setAvailableTimes(data.available_times)
            setReservations(data.todays_res)
        }).catch((e) => {
            console.error(e)
        })
    },[selectedDate])

    // console.log('AVAILABLE TIMES AND RESERVATIONS OBJECTS: ', availableTimes, reservations)

    // SET 24 TEMPLATE COLUMNS
    const hourColumns = Array(24).fill(0).map((_, hour) => {
        const date = new Date(selectedDate)
        date.setHours(hour, 0, 0, 0)
        return date
    })

    // SET 24 SCHEDULE MODEL
    const resScheduleModel = hourColumns.map((datetime, index) => {
        const scheduleColumn = {
            timeMarker: datetime,
            reservations: reservations?.filter((reservation) => {
                const reservationDate = Date.parse(reservation.reservation_time)
                return reservationDate >= datetime && reservationDate < hourColumns[index + 1]
            }),
            availableTimes: availableTimes?.filter((timeslotObj, index) => {
                const availableTime = Date.parse(timeslotObj.datetime)
                return availableTime >= datetime && availableTime < hourColumns[index + 1]
            })
        }
        return(
            scheduleColumn
        )
    })


    console.log('MODEL ARRAY: ', resScheduleModel);

    return(
        <div className={style.res_schedule}>
            <div className={style.schedule_scroll}>
            {resScheduleModel && resScheduleModel.map((column, index) => {
                return(
                    <div key={index} className={style.column}>
                        <div className={style.column_time}>
                            {column.timeMarker.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </div>
                        {column.reservations?.length > 0 && column.reservations.map((reservation) => {
                           return(
                                <div key={reservation.id} className={style.booked_reservation}>
                                    <div className={style.booked_party}>
                                        <UserIcon className={style.party_size_icon} alt="party icon"></UserIcon>
                                        <div className={style.party_size}>
                                            {reservation.party_size}
                                        </div>
                                    </div>
                                    <div className={style.guest}>
                                        {reservation.guest.name}
                                    </div>
                                    <div className={style.table_name}>
                                    </div>
                                </div>
                           )
                        })}
                        {column.availableTimes?.length > 0 && column.availableTimes.map((availableTime, index) => {
                        return(
                            <div key={index} className={style.available_time_card}>
                                <div className={style.available_party}>
                                    <UserIcon className={style.party_size_icon} alt="party icon"></UserIcon>
                                    <div className={style.party_size}>
                                        {availableTime.party_size}
                                    </div>
                            </div>
                                <div className={style.table_name}>
                                </div>
                            </div>
                        )
                        })}
                    </div>
                )
            })}
            </div>

            <div className={style.footer_options}></div>
        </div>
    )
}

export default ResSchedule;
