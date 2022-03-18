import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EstablishmentContext } from '..';
import StatusBar from '../StatusBar';
import BookReservation from '../BookReservation';
import style from './LeftPanel.module.css';
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


const ResList = ({bookRes, setBookRes}) => {
    // const dispatch = useDispatch();
    const reservations = useSelector(state => state.reservations)
    const reservationIds = Object.keys(reservations)
    // const {selectedDate} = useContext(EstablishmentContext);
    const [showStatusBar, setShowStatusBar] = useState(null);
    return(
        <div id={style.scroll_res_list}>
            {reservationIds &&
                reservationIds.map((id) => {
                    const reservation = reservations[id]
                    // console.log('RESERVATION TIMEZONE: ', DateTime.fromISO(reservation))
                    return(
                        <div key={reservation.id} className={style.res_entry}>
                            <div id={style.status_icon}>
                                {reservation.status_id === 3 &&
                                    <ReservedIcon title="Reserved" className={style.icon_blue} onClick={()=>setShowStatusBar(showStatusBar ? null : reservation.id)}/>
                                }
                                {reservation.status_id === 4 &&
                                    <LeftMessageIcon title="Left Message" className={style.icon_blue} onClick={()=>setShowStatusBar(showStatusBar ? null : reservation.id)}/>
                                }
                                {reservation.status_id === 6 &&
                                    <LateIcon title="Late" className={style.icon_red} onClick={()=>setShowStatusBar(showStatusBar ? null : reservation.id)}/>
                                }
                                {reservation.status_id === 7 &&
                                    <PAIcon  title="Partially Arrived" className={style.icon_yellow} onClick={()=>setShowStatusBar(showStatusBar ? null : reservation.id)}/>
                                }
                                {reservation.status_id === 8 &&
                                    <ArrivedIcon  title="Arrived" className={style.icon_yellow} onClick={()=>setShowStatusBar(showStatusBar ? null : reservation.id)}/>
                                }
                                {reservation.status_id === 9 &&
                                    <PSIcon  title="Partially Seated" className={style.icon_green} onClick={()=>setShowStatusBar(showStatusBar ? null : reservation.id)}/>
                                }
                                {reservation.status_id === 10 &&
                                    <SeatedIcon  title="Seated" className={style.icon_green} onClick={()=>setShowStatusBar(showStatusBar ? null : reservation.id)}/>
                                }
                                {reservation.status_id === 11 &&
                                    <CancelIcon  title="Cancelled" className={style.icon_red} onClick={()=>setShowStatusBar(showStatusBar ? null : reservation.id)}/>
                                }
                                {showStatusBar === reservation.id &&
                                    <div id={style.status_sizer}>
                                        <StatusBar setShowStatusBar={setShowStatusBar} reservationId={reservation.id} statusId={reservation.status_id}/>
                                    </div> }
                            </div>
                            <div id={style.res_info_sec}>
                                <div>{reservation.guest}</div>
                                <div id={style.table_name}>{reservation.section_info?.name}</div>
                                <div>{DateTime.fromISO(reservation.reservation_time).toLocaleString({ hour: 'numeric', minute: '2-digit' })}</div>
                                <div id={style.party_size}>{`Guests: ${reservation.party_size}`}</div>
                            </div>
                            <div onClick={()=> setBookRes(reservation)} id={style.edit_button}><EditIcon id={style.edit_icon}/></div>
                        </div>
                    )
                })
            }
            {reservationIds.length === 0 &&
                <div id={style.no_res_message}>No Reservations for Today</div>
            }

        </div>
    )
}

export default ResList;
