import React, {useEffect, useState, useContext} from 'react';
import {useDispatch} from 'react-redux';
import { EstablishmentContext } from '..';
import style from "./ResSchedule.module.css";
import { ReactComponent as UserIcon }from './assets/user-solid.svg';
import AddReservation from '../AddReservation';
import StatusBar from '../StatusBar';
import { getSevenDayAvailability } from '../../../store/sevenDayAvailability';

const ResSchedule =() => {
    const {selectedDate} = useContext(EstablishmentContext);
    const dispatch = useDispatch();
    const [availableTables, setavailableTables] = useState();
    const [showMakeRes, setShowMakeRes] = useState(null);
    const [reservations, setReservations] = useState();
    const [editReservation, setEditReservation] = useState('')


    // FETCH RESERVATIONS AND AVAILABLE TIMES
    useEffect(() => {
        fetch('/api/reservations/today', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"client_date": selectedDate.toISOString()})
        }).then(async (response) => {
            const data = await response.json()
            setavailableTables(data.availability)
            setReservations(data.reservations)
        }).catch((e) => {
            console.error(e)
        })
    },[selectedDate])

    // SET 24 TEMPLATE COLUMNS
    const hourColumns = Array(24).fill(0).map((_, hour) => {
        const date = new Date(selectedDate)
        date.setHours(hour, 0, 0, 0)
        return date
    })

    // SET 24 SCHEDULE MODEL
    const resScheduleModel = hourColumns.map((datetime, hourIndex) => {
        const scheduleColumn = {
            timeMarker: datetime,
            reservations: reservations?.filter((reservation) => {
                const reservationDate = new Date(reservation.reservation_time)
                return reservationDate >= datetime && reservationDate < hourColumns[hourIndex + 1]
            }),
            availableTables: availableTables?.filter((tableTimeSlot) => {
                const availableDatetime = new Date(tableTimeSlot.datetime)
                return availableDatetime >= datetime && availableDatetime < hourColumns[hourIndex + 1]
            })
        }
        return(
            scheduleColumn
        )
    })

    // console.log('MODEL ARRAY: ', resScheduleModel);

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
                               <>
                                <div key={reservation.id} className={style.booked_reservation_card}>
                                    <div className={style.booked_party}>
                                        <UserIcon className={style.party_size_icon} alt="party icon"></UserIcon>
                                        <div className={style.party_size}>
                                            {reservation.party_size}
                                        </div>
                                    </div>
                                    <div className={style.guest}>
                                        {reservation.guest}
                                    </div>
                                    <div className={style.table_name}>
                                        {reservation.table.table_name}
                                    </div>
                                </div>
                                <div key={`hover${reservation.id}`} className={style.booked_hover_info_card}>
                                    <div className={style.hover_table_title}>{reservation.table.table_name}</div>
                                    <div className={style.table_details}>
                                        <div className={style.hover_time}>{new Date(reservation.reservation_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
                                        <div className={style.hover_date}>{new Date(reservation.reservation_time).toLocaleDateString()}</div>
                                        <div className={style.hover_min_max}>{`Min: ${reservation.table.min_seat}, Max: ${reservation.table.max_seat}`}</div>
                                        <div className={style.hover_tags}>{reservation.tags.reduce((prev, curr) => {
                                            return prev + ', ' + curr.name
                                        }, '')}</div>
                                        <StatusBar reservationId={reservation.id} statusId={reservation.status_id}/>
                                    </div>
                                    <div className={style.hover_guest_title}>Guest Info</div>
                                    <div className={style.guest_details}>
                                        <div className={style.hover_name}>{reservation.guest}</div>
                                        <div className={style.hover_notes}>{reservation.guest_info.notes}</div>
                                        <div className={style.hover_party}>{`party-size: ${reservation.party_size}`}</div>
                                        <div className={style.hover_number}>{reservation.guest_info.phone_number}</div>
                                        <div className={style.hover_email}>{reservation.guest_info.email}</div>
                                    </div>
                                    <div onClick={()=>{
                                        dispatch(getSevenDayAvailability(selectedDate)).then(() =>
                                            {setEditReservation(reservation)}
                                        )
                                        }} className={style.edit_reservation_button}>Edit</div>
                                </div>
                                {editReservation && <AddReservation key={`addRes${reservation.id}`} setEditReservation={setEditReservation} editReservation={editReservation}/>}
                            </>
                           )
                        })}
                        {column.availableTables?.length > 0 && column.availableTables.map((availableTable, timeIndex) => {
                            const tableTime  = new Date(availableTable.datetime);
                            if (tableTime > new Date()) {
                                return(
                                    <>
                                    <div key={timeIndex} onClick={()=>dispatch(getSevenDayAvailability(selectedDate)).then(() => setShowMakeRes(timeIndex))} className={style.available_time_card}>
                                        <div className={style.available_party}>
                                            <UserIcon className={style.party_size_icon} alt="party icon"></UserIcon>
                                            <div className={style.party_size}>
                                                {`${availableTable.table.min_seat} - ${availableTable.table.max_seat}`}
                                            </div>
                                        </div>
                                        <div className={style.spacer}></div>
                                        <div className={style.table_name}>
                                            {availableTable.table.table_name}
                                        </div>
                                    </div>
                                    {showMakeRes === timeIndex && <AddReservation key={`avail${timeIndex}`} setShowMakeRes={setShowMakeRes} availableTable={availableTable}/>}
                                    </>
                                )
                            } else {
                                return(null)
                            }
                            })
                        }
                    </div>
                )
            })}
            </div>

            <div className={style.footer_options}>More schdule options coming...</div>
        </div>
    )
}

export default ResSchedule;
