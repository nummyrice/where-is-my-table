import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import style from './LeftPanel.module.css';
import StatusBar from '../StatusBar';
import AddWaitlist from '../AddWaitlist';

import { ReactComponent as EditIcon } from './assets/chevron-right-solid.svg';
import { ReactComponent as CancelIcon } from '../StatusBar//assets/times-circle-regular.svg';
import { ReactComponent as LateIcon } from '../StatusBar//assets/exclamation-circle-solid.svg';
import { ReactComponent as PSIcon } from '../StatusBar//assets/dot-circle-solid.svg';
import { ReactComponent as PAIcon } from '../StatusBar//assets/dot-circle-regular.svg';
import { ReactComponent as ArrivedIcon } from '../StatusBar//assets/check-circle-regular.svg';
import { ReactComponent as SeatedIcon } from '../StatusBar//assets/check-circle-solid.svg';
import { ReactComponent as ReservedIcon } from '../StatusBar//assets/circle-solid.svg';
import { ReactComponent as LeftMessageIcon } from '../StatusBar//assets/spinner-solid.svg';

const Waitlist = () => {
    const waitlist = useSelector(state => state.selectedDateWaitlist)
    const [showStatusBar, setShowStatusBar] = useState(null);
    const [editWaitlist, setEditWaitlist] = useState('')
    return(
        <div id={style.scroll_res_list}>
            {waitlist.length > 0 &&
                waitlist.map((waitlistEntry, index) => {
                    // console.log('RESERVATION: ', reservation)
                    return(
                        <div key={waitlistEntry.id} className={style.res_entry}>
                            <div id={style.status_icon}>
                                {waitlistEntry.status_id === 3 &&
                                    <ReservedIcon title="Reserved" className={style.icon_blue} onClick={()=>setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}/>
                                }
                                {waitlistEntry.status_id === 4 &&
                                    <LeftMessageIcon title="Left Message" className={style.icon_blue} onClick={()=>setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}/>
                                }
                                {waitlistEntry.status_id === 6 &&
                                    <LateIcon title="Late" className={style.icon_red} onClick={()=>setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}/>
                                }
                                {waitlistEntry.status_id === 7 &&
                                    <PAIcon  title="Partially Arrived" className={style.icon_yellow} onClick={()=>setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}/>
                                }
                                {waitlistEntry.status_id === 8 &&
                                    <ArrivedIcon  title="Arrived" className={style.icon_yellow} onClick={()=>setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}/>
                                }
                                {waitlistEntry.status_id === 9 &&
                                    <PSIcon  title="Partially Seated" className={style.icon_green} onClick={()=>setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}/>
                                }
                                {waitlistEntry.status_id === 10 &&
                                    <SeatedIcon  title="Seated" className={style.icon_green} onClick={()=>setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}/>
                                }
                                {waitlistEntry.status_id === 11 &&
                                    <CancelIcon  title="Cancelled" className={style.icon_red} onClick={()=>setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}/>
                                }
                                {showStatusBar === waitlistEntry.id &&
                                    <div id={style.status_sizer}>
                                        <StatusBar setShowStatusBar={setShowStatusBar} waitlistEntryId={waitlistEntry.id} statusId={waitlistEntry.status_id}/>
                                    </div> }
                            </div>
                            <div id={style.res_info_sec}>
                                <div>{waitlistEntry.guest_info.name}</div>
                                <div>{new Date(waitlistEntry.created_at).toLocaleTimeString('en-Us', { hour: 'numeric', minute: '2-digit' })}</div>
                                <div id={style.party_size}>{`Guests: ${waitlistEntry.party_size}`}</div>
                            </div>
                            <div onClick={()=>setEditWaitlist(waitlistEntry)} id={style.edit_button}>
                                <EditIcon id={style.edit_icon}/></div>
                            {editWaitlist && <AddWaitlist editWaitlist={editWaitlist} setEditWaitlist={setEditWaitlist}/>}
                        </div>
                    )
                })
            }
            {!waitlist.length &&
                <div id={style.no_res_message}>Today's waitlist is empty.</div>
            }

        </div>
    )
}

export default Waitlist;
