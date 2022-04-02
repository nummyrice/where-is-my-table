import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import style from './LeftPanel.module.css';
import StatusBar from '../StatusBar';
import { deleteAndUnsetParty, updateAndSetPartyStatus } from '../../../store/selectedDateWaitlist';
import Portal from '../../Portal';
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

const Waitlist = ({searchTerm, sort, order, setEditWaitlist}) => {
    const dispatch = useDispatch();
    const waitlist = useSelector(state => state.selectedDateWaitlist)
    const [showStatusBar, setShowStatusBar] = useState(null);
    const [counter, setCounter] = useState(1);
    const [coords, setCoords] = useState(null);
    useEffect(() => {
        const intervalId = setInterval(()=>setCounter(prevCounter => prevCounter + 1), 6000)
        return clearInterval(intervalId)
    }, [])

    const lateStatusUpdate = (waitlistEntryId) => {
        dispatch(updateAndSetPartyStatus(waitlistEntryId, 6))
    }

    const getCoords = (e) => {
        const rect = e.target.getBoundingClientRect();
        setCoords({
          left: (rect.x + rect.width / 2) + 20,
          top: (rect.y + window.scrollY) - 20
        });
      }

    //default sorts earliest times to latest times
    // created at
    // created at + quoted
    // now
    // created at + quoted - now === diff
    // sorted by lowest diff
    const sortByTime = (a, b) => {
        const now = DateTime.local()
        const aDiff = DateTime.fromISO(a.created_at).plus({minutes: a.estimated_wait}).diff(now, 'minutes').toObject().minutes
        const bDiff = DateTime.fromISO(b.created_at).plus({minutes: b.estimated_wait}).diff(now, 'minutes').toObject().minutes
        if (aDiff > bDiff) return 1;
        if (aDiff < bDiff) return -1;
        return 0;
    }

    // default sorts alphabetical by guest name
    const sortByGuest = (a, b) => {
        const aPartyGuest = a.guest.toLowerCase()
        const bPartyGuest = b.guest.toLowerCase()
        if (aPartyGuest > bPartyGuest) return 1;
        if (aPartyGuest < bPartyGuest) return -1;
        return 0;
    }

    // default sorts least party to greatest
    const sortByParty = (a, b) => {
        const aPartySize = a.party_size
        const bPartySize = b.party_size
        if (aPartySize > bPartySize) return 1;
        if (aPartySize < bPartySize) return -1;
        return 0;
    }

    // default sorts status id asc
    const sortByStatus = (a, b) => {
        const aPartyStatus = a.status_id
        const bPartyStatus = b.status_id
        if (aPartyStatus > bPartyStatus) return 1;
        if (aPartyStatus < bPartyStatus) return -1;
        return 0;
    }

    // default sorts updated at earliest first
    const sortByUpdated = (a, b) => {
        const aUpdatedAt = DateTime.fromISO(a.updated_at)
        const bUpdatedAt = DateTime.fromISO(b.updated_at)
        if (aUpdatedAt > bUpdatedAt) return 1;
        if (aUpdatedAt < bUpdatedAt) return -1;
        return 0;
    }

    // default sorts created at earliest first
    const sortCreatedAt = (a, b) => {
        const aCreatedAt = DateTime.fromISO(a.created_at)
        const bCreatedAt = DateTime.fromISO(b.created_at)
        if (aCreatedAt > bCreatedAt) return 1;
        if (aCreatedAt < bCreatedAt) return -1;
        return 0;
    }

    const filterBySearchTerm = (waitlistEntry) => {
        if (waitlistEntry.guest.toLowerCase().includes(searchTerm)) return true;
        if (waitlistEntry.guest_info.email?.toLowerCase().includes(searchTerm)) return true;
        if (waitlistEntry.guest_info.phone_number.includes(searchTerm)) return true;
        return false;
    }

        // apply filters
    const sortedWaitlist = useMemo(() => {
        const waitlistCopy = [...waitlist]
        if (sort === 'time') waitlistCopy.sort(sortByTime);
        if (sort === 'guest') waitlistCopy.sort(sortByGuest);
        if (sort === 'party-size') waitlistCopy.sort(sortByParty);
        if (sort === 'section') waitlistCopy.sort(sortByTime);
        if (sort === 'status') waitlistCopy.sort(sortByStatus);
        if (sort === 'updated') waitlistCopy.sort(sortByUpdated);
        if (sort === 'created') waitlistCopy.sort(sortCreatedAt);
        if (order === 'desc') waitlistCopy.reverse();
        if (searchTerm) return waitlistCopy.filter(filterBySearchTerm);
        return waitlistCopy;
    }, [order, waitlist, sort, searchTerm])

    return(
        <div id={style.scroll_res_list}>
            {sortedWaitlist.length > 0 &&
                sortedWaitlist.map((waitlistEntry) => {
                    const createdAt = DateTime.fromISO(waitlistEntry.created_at)
                    const deadline = createdAt.plus({minutes: waitlistEntry.estimated_wait})
                    const now = DateTime.local()
                    const diff = deadline.diff(now, 'minutes').toObject().minutes
                    const roundedDiff = Math.ceil(diff)
                    if (roundedDiff < 0 && waitlistEntry.status_id === 5) {
                        lateStatusUpdate(waitlistEntry.id)
                    }
                    return(
                        <div key={waitlistEntry.id} className={style.waitlist_entry}>
                            <div id={style.status_icon}>
                                {waitlistEntry.status_id === 5 &&
                                    <ReservedIcon title="Reserved" className={style.icon_blue} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}}/>
                                }
                                {waitlistEntry.status_id === 4 &&
                                    <LeftMessageIcon title="Left Message" className={style.icon_blue} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}}/>
                                }
                                {waitlistEntry.status_id === 6 &&
                                    <LateIcon title="Late" className={style.icon_red} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}}/>
                                }
                                {waitlistEntry.status_id === 7 &&
                                    <PAIcon  title="Partially Arrived" className={style.icon_yellow} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}}/>
                                }
                                {waitlistEntry.status_id === 8 &&
                                    <ArrivedIcon  title="Arrived" className={style.icon_yellow} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}}/>
                                }
                                {waitlistEntry.status_id === 9 &&
                                    <PSIcon  title="Partially Seated" className={style.icon_green} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}}/>
                                }
                                {waitlistEntry.status_id === 10 &&
                                    <SeatedIcon  title="Seated" className={style.icon_green} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}}/>
                                }
                                {waitlistEntry.status_id === 11 &&
                                    <CancelIcon  title="Cancelled" className={style.icon_red} onClick={(e)=>{getCoords(e); setShowStatusBar(showStatusBar ? null : waitlistEntry.id)}}/>
                                }
                                {showStatusBar === waitlistEntry.id &&

                                        <Portal id={style.status_sizer}>
                                            <div className={style.status_background} onClick={()=>setShowStatusBar(false)}>
                                             <StatusBar coords={coords} setShowStatusBar={setShowStatusBar} waitlistEntryId={waitlistEntry.id} statusId={waitlistEntry.status_id}/>
                                            </div>
                                        </Portal>

                                    }
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
            {(!sortedWaitlist.length && searchTerm) &&
                <div id={style.no_res_message}>Search does not match any party</div>
            }
            </div>
    )
}

export default Waitlist;
