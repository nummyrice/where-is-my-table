import React from 'react';
import { useSelector } from 'react-redux';
import style from './LeftPanel.module.css';

const ResList = () => {
    const selectedDateRes = useSelector(state => state.selectedDateAvailability.reservations)
    return(
        <div id={style.scroll_res_list}>
            {selectedDateRes.length > 0 &&
                selectedDateRes.map((reservation) => {
                    console.log('RESERVATION: ', reservation)
                    return(
                        <div id={style[reservation.id]} className={style.res_entry}>
                            <div id={style.status_icon}>{reservation.status.name}</div>
                            <div id={style.res_info_sec}>{reservation.guest}</div>
                            <div id={style.edit_button}></div>
                        </div>
                    )
                })
            }
            {!selectedDateRes.length &&
                <div id={style.no_res_message}>No Reservations for Today</div>
            }

        </div>
    )
}

export default ResList;
