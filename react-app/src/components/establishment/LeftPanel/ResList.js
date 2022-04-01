import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StatusBar from '../StatusBar';
import BookReservation from '../BookReservation';
import { updateAndSetResStatus } from '../../../store/reservations';
import style from './LeftPanel.module.css';
import Portal from '../../Portal';
import { DateTime } from 'luxon';
import { ReactComponent as EditIcon } from './assets/chevron-right-solid.svg';
import { ReactComponent as CancelIcon } from '../StatusBar//assets/times-circle-regular.svg';
import { ReactComponent as LateIcon } from '../StatusBar//assets/exclamation-circle-solid.svg';
import { ReactComponent as PSIcon } from '../StatusBar//assets/dot-circle-solid.svg';
import { ReactComponent as PAIcon } from '../StatusBar//assets/dot-circle-regular.svg';
import { ReactComponent as ArrivedIcon } from '../StatusBar//assets/check-circle-regular.svg';
import { ReactComponent as SeatedIcon } from '../StatusBar//assets/check-circle-solid.svg';
import { ReactComponent as ReservedIcon } from '../StatusBar//assets/circle-solid.svg';
import { ReactComponent as LeftMessageIcon } from '../StatusBar//assets/spinner-solid.svg';
import { ReactComponent as Guest } from '../ResSchedule/assets/user-solid.svg'
import { ReactComponent as BookIcon } from './assets/book-open-solid.svg'


const ResList = ({searchTerm, sort, order, bookRes, setBookRes}) => {
    const dispatch = useDispatch()
    const reservations = useSelector(state => state.reservations)
    const [showStatusBar, setShowStatusBar] = useState(null);
    const [coords, setCoords] = useState(null);

    const getCoords = (e) => {
        const rect = e.target.getBoundingClientRect();
        setCoords({
          left: (rect.x + rect.width / 2) + 20,
          top: (rect.y + window.scrollY) - 20
        });
    }

    const lateStatusUpdate = (reservationId) => {
        dispatch(updateAndSetResStatus(reservationId, 6))
    }
    //default sorts earliest times to latest times
    const sortByTime = (a, b) => {
        const aResTime = DateTime.fromISO(reservations[a].reservation_time)
        const bResTime = DateTime.fromISO(reservations[b].reservation_time)
        if (aResTime > bResTime) return 1;
        if (aResTime < bResTime) return -1;
        return 0;
    }

    // default sorts alphabetical by guest name
    const sortByGuest = (a, b) => {
        const aResGuest = reservations[a].guest.toLowerCase()
        const bResGuest = reservations[b].guest.toLowerCase()
        if (aResGuest > bResGuest) return 1;
        if (aResGuest < bResGuest) return -1;
        return 0;
    }

    // default sorts least party to greatest
    const sortByParty = (a, b) => {
        const aResParty = reservations[a].party_size
        const bResParty = reservations[b].party_size
        if (aResParty > bResParty) return 1;
        if (aResParty < bResParty) return -1;
        return 0;
    }

    // default sorts alphabetically by section
    const sortBySection = (a, b) => {
        const aResSection = reservations[a].section_info ? reservations[a].section_info.name.toLowerCase() : 'zzzz'
        const bResSection = reservations[b].section_info ? reservations[b].section_info.name.toLowerCase() : 'zzzz'
        if (aResSection > bResSection) return 1;
        if (aResSection < bResSection) return -1;
        return 0;
    }

    // default sorts status id asc
    const sortByStatus = (a, b) => {
        const aResStatus = reservations[a].status_id
        const bResStatus = reservations[b].status_id
        if (aResStatus > bResStatus) return 1;
        if (aResStatus < bResStatus) return -1;
        return 0;
    }

    // default sorts updated at earliest first
    const sortByUpdated = (a, b) => {
        const aResUpdatedAt = DateTime.fromISO(reservations[a].updated_at)
        const bResUpdatedAt = DateTime.fromISO(reservations[b].updated_at)
        if (aResUpdatedAt > bResUpdatedAt) return 1;
        if (aResUpdatedAt < bResUpdatedAt) return -1;
        return 0;
    }

    // default sorts created at earliest first
    const sortCreatedAt = (a, b) => {
        const aCreatedAt = DateTime.fromISO(reservations[a].created_at)
        const bCreatedAt = DateTime.fromISO(reservations[b].created_at)
        if (aCreatedAt > bCreatedAt) return 1;
        if (aCreatedAt < bCreatedAt) return -1;
        return 0;
    }

    const filterBySearchTerm = (id) => {
        const reservation = reservations[id];
        if (reservation.guest.toLowerCase().includes(searchTerm)) return true;
        if (reservation.email?.toLowerCase().includes(searchTerm)) return true;
        if (reservation.guest_info.phone_number.includes(searchTerm)) return true;
        return false;
    }
    // apply filters
    const reservationIds = (() => {
        const reservationIds = Object.keys(reservations)
        if (sort === 'time') reservationIds.sort(sortByTime);
        if (sort === 'guest') reservationIds.sort(sortByGuest);
        if (sort === 'party-size') reservationIds.sort(sortByParty);
        if (sort === 'section') reservationIds.sort(sortBySection);
        if (sort === 'status') reservationIds.sort(sortByStatus);
        if (sort === 'updated') reservationIds.sort(sortByUpdated);
        if (sort === 'created') reservationIds.sort(sortCreatedAt);
        if (order === 'desc') reservationIds.reverse();
        if (searchTerm) return reservationIds.filter(filterBySearchTerm);
        return reservationIds;
    })()
    return(
        <div id={style.scroll_res_list}>
            {reservationIds &&
                reservationIds.map((id) => {
                    const reservation = reservations[id]
                    const res_time = DateTime.fromISO(reservation.reservation_time)
                    const now = DateTime.local()

                    if (now > res_time && reservation.status_id === 3) {
                        lateStatusUpdate(reservation.id)
                    }
                    return(
                        <div key={id} className={style.res_entry}>
                            <div id={style.status_icon}>
                                {reservation.status_id === 3 &&
                                    <ReservedIcon title="Reserved" className={style.icon_blue} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : reservation.id)}}/>
                                }
                                {reservation.status_id === 4 &&
                                    <LeftMessageIcon title="Left Message" className={style.icon_blue} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : reservation.id)}}/>
                                }
                                {reservation.status_id === 6 &&
                                    <LateIcon title="Late" className={style.icon_red} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : reservation.id)}}/>
                                }
                                {reservation.status_id === 7 &&
                                    <PAIcon  title="Partially Arrived" className={style.icon_yellow} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : reservation.id)}}/>
                                }
                                {reservation.status_id === 8 &&
                                    <ArrivedIcon  title="Arrived" className={style.icon_yellow} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : reservation.id)}}/>
                                }
                                {reservation.status_id === 9 &&
                                    <PSIcon  title="Partially Seated" className={style.icon_green} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : reservation.id)}}/>
                                }
                                {reservation.status_id === 10 &&
                                    <SeatedIcon  title="Seated" className={style.icon_green} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : reservation.id)}}/>
                                }
                                {reservation.status_id === 11 &&
                                    <CancelIcon  title="Cancelled" className={style.icon_red} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : reservation.id)}}/>
                                }
                                 {showStatusBar === reservation.id &&
                                    <Portal id={style.status_sizer}>
                                        <div className={style.status_background} onClick={()=>setShowStatusBar(false)}>
                                        <StatusBar coords={coords} setShowStatusBar={setShowStatusBar} reservationId={reservation.id} statusId={reservation.status_id}/>
                                        </div>
                                    </Portal>
                                }
                            </div>
                            <div id={style.res_info_sec}>
                                <div>{reservation.guest}</div>
                                <div id={style.table_name}>{reservation.section_info?.name}</div>
                                <div><BookIcon className={style.booked_icon} />{DateTime.fromISO(reservation.reservation_time).toLocaleString({ hour: 'numeric', minute: '2-digit' })}</div>
                                <div id={style.party_size}><Guest className={style.party_size_icon}/>{`${reservation.party_size}`}</div>
                            </div>
                            <div onClick={()=> setBookRes(reservation)} id={style.edit_button}><EditIcon id={style.edit_icon}/></div>
                        </div>
                    )
                })
            }
            {!Object.keys(reservations).length &&
                <div id={style.no_res_message}>No Reservations for Today</div>
            }
            {(!reservationIds.length && searchTerm) &&
                <div id={style.no_res_message}>Search does not match any reservation</div>
            }

        </div>
    )
}

export default ResList;
