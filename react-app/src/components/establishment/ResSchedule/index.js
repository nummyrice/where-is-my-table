import React, { useState, useContext } from 'react';
import {useSelector} from 'react-redux';
import { EstablishmentContext } from '..';
import style from "./ResSchedule.module.css";
import { ReactComponent as UserIcon }from './assets/user-solid.svg';
// import AddReservation from '../AddReservation';
import StatusBar from '../StatusBar';
// import { getSevenDayAvailability } from '../../../store/sevenDayAvailability';
import { DateTime } from 'luxon';
import { Modal } from '../../../context/Modal';
import BookReservation from '../BookReservation';

const ResSchedule =() => {
    const {selectedDate} = useContext(EstablishmentContext);
    // const dispatch = useDispatch();
    // const [availableTables, setavailableTables] = useState();
    // const [showMakeRes, setShowMakeRes] = useState(null);
    // const [reservations, setReservations] = useState();
    const [bookRes, setBookRes] = useState(null);    // const availableTables = useSelector(state => state.selectedDateAvailability.availability)
    const [scheduleScale, setScheduleScale] = useState({slots: 96, interval: 15})
    const reservations = useSelector(state => state.reservations)

    // FETCH RESERVATIONS AND AVAILABLE TIMES
    // useEffect(() => {
    //     fetch('/api/reservations/today', {
    //         method: 'POST',
    //         headers: {"Content-Type": "application/json"},
    //         body: JSON.stringify({"client_date": selectedDate.toISOString()})
    //     }).then(async (response) => {
    //         const data = await response.json()
    //         setavailableTables(data.availability)
    //         setReservations(data.reservations)
    //     }).catch((e) => {
    //         console.error(e)
    //     })
    // },[selectedDate])

    //scheduleScale
        // 15 minutes
            // slots: 96
        // 30 minutes
            // slots: 48
        // 60 minutes
            // slots 24

    // SET 24 TEMPLATE COLUMNS
    const resScheduleModel = Array(scheduleScale.slots).fill(0).map((_, minutesMultiplier) => {
        const columnTime = selectedDate.plus({minute:scheduleScale.interval * minutesMultiplier});
        const nextColumnTime = columnTime.plus({minute:scheduleScale.interval})
        const resKeys = Object.keys(reservations)
        const columnRes = resKeys.filter((id) => {
            const res = reservations[id]
            const reservationTime = DateTime.fromISO(res.reservation_time)
            if (columnTime.toMillis() <= reservationTime.toMillis() && nextColumnTime.toMillis() > reservationTime.toMillis()) {
                return true;
            }
            return false;
        }).map((id)=>reservations[id])
        return {columnTime, reservations:columnRes}
    })

    const getNowIndicatorPosition = (interval) => {
        const todaysMinutes = Math.ceil(DateTime.local().diff(DateTime.local().startOf('day'), 'minutes').toObject().minutes)
        if (interval === 15) return {left:  `${todaysMinutes * 7.28 - 42}px`};
        if (interval === 30) return {left: `${todaysMinutes * 3.71 - 42}px`};
        if (interval === 60) return {left: `${todaysMinutes * 1.83 - 42}px`};
    }
    // SET 24 SCHEDULE MODEL
    // const resScheduleModel = timeColumns.map((datetime, hourIndex) => {
    //     const scheduleColumn = {
    //         timeMarker: datetime,
    //         reservations: reservations?.filter((reservation) => {
    //             const reservationDate = new Date(reservation.reservation_time)
    //             if (reservationDate >= datetime && reservationDate < timeColumns[hourIndex + 1]) {
    //             }
    //             return reservationDate >= datetime && reservationDate < timeColumns[hourIndex + 1]
    //         }),
    //         availableTables: availableTables?.filter((tableTimeSlot) => {
    //             const availableDatetime = new Date(tableTimeSlot.datetime)
    //             return availableDatetime >= datetime && availableDatetime < timeColumns[hourIndex + 1]
    //         })
    //     }
    //     return(
    //         scheduleColumn
    //     )
    // })

    // console.log('MODEL ARRAY: ', resScheduleModel);
    return(
        <div className={style.res_schedule}>
            <div id={"schedule_scroll"} className={style.schedule_scroll}>
                {DateTime.local().toISODate() === selectedDate.toISODate() &&
                    <div
                        // style={{left: `${420 + 42.5}px`}}
                        style={getNowIndicatorPosition(scheduleScale.interval)}
                        id={"current_time_indicator"}
                        className={style.current_time_indicator}
                    >{DateTime.local().toLocaleString({hour: '2-digit', minute: '2-digit'})}
                    </div>
                }
            {resScheduleModel.map((column, index) => {
                return(
                    <div key={`column ${index}`} className={style.column}>
                        <div style={{ "fontFamily": "sans-serif", "width": "100px","textAlign": "center"}} className={"column_time"}>
                            {column.columnTime.toLocaleString({hour: '2-digit', minute: '2-digit'})}
                        </div>
                        {column.reservations.map((reservation) => {
                           return(
                               <React.Fragment key={reservation.id}>
                                <div  className={style.booked_reservation_card}>
                                    <div className={style.booked_party}>
                                        <UserIcon className={style.party_size_icon} alt="party icon"></UserIcon>
                                        <div className={style.party_size}>
                                            {reservation.party_size}
                                        </div>
                                    </div>
                                    <div className={style.guest}>
                                        {reservation.guest}
                                    </div>
                                    {reservation.section && <div className={style.table_name}>{reservation.section_info.name}</div>}
                                    {!reservation.section && <div style={{"fontSize": "10px"}} className={style.table_name}>{"section not selected"}</div>}
                                </div>
                                <div  className={style.booked_hover_info_card}>
                                    <div className={style.hover_table_title}>{"Reservation Details"}</div>
                                    <div className={style.table_details}>
                                        <div className={style.hover_time}>{DateTime.fromISO(reservation.reservation_time).toLocaleString({hour: '2-digit', minute: '2-digit'})}</div>
                                        <div className={style.hover_date}>{DateTime.fromISO(reservation.reservation_time).toLocaleString()}</div>
                                        {reservation.table && <div className={style.hover_min_max}>{`Min: ${reservation.table.min_seat}, Max: ${reservation.table.max_seat}`}</div>}
                                        {!reservation.table && <div className={style.hover_min_max}>{"table not selected"}</div>}
                                        <div className={style.hover_tags}>{reservation.tags.reduce((prev, curr) => {
                                            return prev + ', ' + curr.name
                                        }, '')}</div>
                                        <div className={style.status_sizer}>
                                            <StatusBar reservationId={reservation.id} statusId={reservation.status_id}/>
                                        </div>
                                    </div>
                                    <div className={style.hover_guest_title}>Guest Info</div>
                                    <div className={style.guest_details}>
                                        <div className={style.hover_name}>{reservation.guest}</div>
                                        <div className={style.hover_notes}>{reservation.guest_info.notes}</div>
                                        <div className={style.hover_party}>{`party-size: ${reservation.party_size}`}</div>
                                        <div className={style.hover_number}>{reservation.guest_info.phone_number}</div>
                                        <div className={style.hover_email}>{reservation.guest_info.email}</div>
                                    </div>
                                    <div onClick={()=>setBookRes(reservation)} className={style.edit_reservation_button}>Edit</div>
                                </div>
                            </React.Fragment>
                           )
                        })}
                        {/* {column.availableTables?.length > 0 && column.availableTables.map((availableTable, timeIndex) => {
                            const tableTime  = new Date(availableTable.datetime);
                            if (tableTime > new Date()) {
                                return(
                                    <React.Fragment key={"" + availableTable.table.id + availableTable.datetime}>
                                    <div onClick={()=>dispatch(getSevenDayAvailability(selectedDate)).then(() => setShowMakeRes({tableId: availableTable.table.id, datetime: availableTable.datetime}))} className={style.available_time_card}>
                                        <div className={style.available_party}>
                                            <UserIcon className={style.party_size_icon} alt="party icon"></UserIcon>
                                            <div className={style.party_size}>
                                                {`${availableTable.table.min_seat} - ${availableTable.table.max_seat}`}
                                            </div>
                                        </div>
                                        <div className={style.spacer}></div>
                                        <div className={style.table_name}>
                                            {availableTable.section_id}
                                        </div>
                                    </div>
                                    {showMakeRes?.tableId === availableTable.table.id && new Date(showMakeRes.datetime).getTime() === new Date(availableTable.datetime).getTime() && <AddReservation key={`avail${timeIndex}`} setShowMakeRes={setShowMakeRes} availableTable={availableTable}/>}
                                    </React.Fragment>
                                )
                            } else {
                                return(null)
                            }
                            })
                        } */}
                    </div>
                )
            })}
                        {bookRes &&
                <Modal onClose={() => setBookRes(false)}>
                    <BookReservation setBookRes={setBookRes} bookRes={bookRes}/>
                </Modal>}
            </div>

            <div className={style.footer_options}>
                <div id={style.interval_options}>
                    <label>Adjust Interval</label>
                    <div id={style.fifteen} className={`${scheduleScale.interval === 15 ? style.interval_select : null}`} onClick={() => setScheduleScale({slots: 96, interval: 15})}>{"15m"}</div>
                    <div id={style.thirty} className={`${scheduleScale.interval === 30 ? style.interval_select : null}`} onClick={() => setScheduleScale({slots: 48, interval: 30})}>{"30m"}</div>
                    <div id={style.sixty} className={`${scheduleScale.interval === 60 ? style.interval_select : null}`} onClick={() => setScheduleScale({slots: 24, interval: 60})}>{"1hr"}</div>
                </div>
            </div>
        </div>
    )
}

export default ResSchedule;
