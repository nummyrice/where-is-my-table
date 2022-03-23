import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import style from './LeftPanel.module.css';
import StatusBar from '../StatusBar';
import AddWaitlist from '../AddWaitlist';
import { deleteAndUnsetParty } from '../../../store/selectedDateWaitlist';

import { ReactComponent as EditIcon } from './assets/chevron-right-solid.svg';
import { ReactComponent as CancelIcon } from '../StatusBar//assets/times-circle-regular.svg';
import { ReactComponent as LateIcon } from '../StatusBar//assets/exclamation-circle-solid.svg';
import { ReactComponent as PSIcon } from '../StatusBar//assets/dot-circle-solid.svg';
import { ReactComponent as PAIcon } from '../StatusBar//assets/dot-circle-regular.svg';
import { ReactComponent as ArrivedIcon } from '../StatusBar//assets/check-circle-regular.svg';
import { ReactComponent as SeatedIcon } from '../StatusBar//assets/check-circle-solid.svg';
import { ReactComponent as ReservedIcon } from '../StatusBar//assets/circle-solid.svg';
import { ReactComponent as LeftMessageIcon } from '../StatusBar//assets/spinner-solid.svg';
import { ReactComponent as EditPartyIcon } from '../AddGuest/assets/edit-regular.svg';
import { ReactComponent as TrashIcon } from './assets/trash-alt-solid.svg';
import { ReactComponent as Guest } from '../ResSchedule/assets/user-solid.svg'
import { ReactComponent as CheckIn } from '../TopBar/assets/calendar-check-regular.svg'
import { DateTime } from 'luxon';

const Waitlist = ({setEditWaitlist}) => {
    const dispatch = useDispatch();
    const waitlist = useSelector(state => state.selectedDateWaitlist)
    const [showStatusBar, setShowStatusBar] = useState(null);
    const [counter, setCounter] = useState(1)
    console.log('counter: ', counter)
    useEffect(() => {
        const intervalId = setInterval(()=>setCounter(prevCounter => prevCounter + 1), 60000)
        return clearInterval(intervalId)
    }, [counter])
    return(
        <div id={style.scroll_res_list}>
            {waitlist.length > 0 &&
                waitlist.map((waitlistEntry, index) => {
                    const createdAt = DateTime.fromISO(waitlistEntry.created_at)
                    const deadline = createdAt.plus({minutes: waitlistEntry.estimated_wait})
                    const now = DateTime.local()
                    const diff = deadline.diff(now, 'minutes').toObject().minutes
                    const roundedDiff = Math.ceil(diff)
                    return(
                        <div key={waitlistEntry.id} className={style.waitlist_entry}>
                            <div id={style.status_icon}>
                                {waitlistEntry.status_id === 5 &&
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
                                    </div>}
                            </div>
                            <div id={style.party_info_sec}>
                                <div>{waitlistEntry.guest_info.name}</div>
                                <div id={style.party_size}><Guest className={style.party_size_icon}/>{`${waitlistEntry.party_size}`}</div>
                                <div><CheckIn className={style.checkin_icon}/>{`${DateTime.fromISO(waitlistEntry.created_at).toLocaleString({ hour: 'numeric', minute: '2-digit' })}`}</div>
                                <div className={`${style.counter} ${roundedDiff < 0 ? style.negative : style.positive}`}>{`${Math.abs(roundedDiff)} m`}</div>
                            </div>
                            <div id={style.time_track}></div>
                            <div id={style.edit_delete_buttons}>
                                <div id={style.edit_party_icon}>
                                    <EditPartyIcon onClick={()=>setEditWaitlist(waitlistEntry)} className={style.waitlist_icon}/>
                                </div>
                                <div onClick={() => dispatch(deleteAndUnsetParty(waitlistEntry.id))} id={style.delete_party_icon}>
                                    <TrashIcon className={style.waitlist_icon}/>
                                </div>
                            </div>
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
