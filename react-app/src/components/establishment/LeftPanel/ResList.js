import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import StatusBar from '../StatusBar';
import style from './LeftPanel.module.css';
import { ReactComponent as EditIcon } from './assets/chevron-right-solid.svg';
import { ReactComponent as CancelIcon } from '../StatusBar//assets/times-circle-regular.svg';
import { ReactComponent as LateIcon } from '../StatusBar//assets/exclamation-circle-solid.svg';
import { ReactComponent as PSIcon } from '../StatusBar//assets/dot-circle-solid.svg';
import { ReactComponent as PAIcon } from '../StatusBar//assets/dot-circle-regular.svg';
import { ReactComponent as ArrivedIcon } from '../StatusBar//assets/check-circle-regular.svg';
import { ReactComponent as SeatedIcon } from '../StatusBar//assets/check-circle-solid.svg';
import { ReactComponent as ReservedIcon } from '../StatusBar//assets/circle-solid.svg';
import { ReactComponent as LeftMessageIcon } from '../StatusBar//assets/spinner-solid.svg';

const ResList = () => {
    const selectedDateRes = useSelector(state => state.selectedDateAvailability.reservations)
    const [showStatusBar, setShowStatusBar] = useState(false);
    return(
        <div id={style.scroll_res_list}>
            {selectedDateRes.length > 0 &&
                selectedDateRes.map((reservation) => {
                    // console.log('RESERVATION: ', reservation)
                    return(
                        <div key={reservation.id} className={style.res_entry}>
                            <div id={style.status_icon}>
                                {reservation.status_id === 3 &&
                                    <ReservedIcon className={style.icon_blue} onClick={()=>setShowStatusBar(!showStatusBar)}/>
                                }
                                {reservation.status_id === 4 &&
                                    <LeftMessageIcon className={style.icon_blue} onClick={()=>setShowStatusBar(!showStatusBar)}/>
                                }
                                {reservation.status_id === 6 &&
                                    <LateIcon className={style.icon_red} onClick={()=>setShowStatusBar(!showStatusBar)}/>
                                }
                                {reservation.status_id === 7 &&
                                    <PAIcon className={style.icon_yellow} onClick={()=>setShowStatusBar(!showStatusBar)}/>
                                }
                                {reservation.status_id === 8 &&
                                    <ArrivedIcon className={style.icon_yellow} onClick={()=>setShowStatusBar(!showStatusBar)}/>
                                }
                                {reservation.status_id === 9 &&
                                    <PSIcon className={style.icon_green} onClick={()=>setShowStatusBar(!showStatusBar)}/>
                                }
                                {reservation.status_id === 10 &&
                                    <SeatedIcon className={style.icon_green} onClick={()=>setShowStatusBar(!showStatusBar)}/>
                                }
                                {reservation.status_id === 11 &&
                                    <CancelIcon className={style.icon_red} onClick={()=>setShowStatusBar(!showStatusBar)}/>
                                }
                                {showStatusBar &&
                                    <div id={style.status_sizer}>
                                        <StatusBar setShowStatusBar={setShowStatusBar} reservationId={reservation.id} statusId={reservation.status_id}/>
                                    </div> }
                            </div>
                            <div id={style.res_info_sec}>{reservation.guest}</div>
                            <div id={style.edit_button}><EditIcon id={style.edit_icon}/></div>
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
