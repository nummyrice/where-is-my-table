import React, { useState } from 'react'
import style from "./LeftPanel.module.css"
import ResList from './ResList'
import Waitlist from './Waitlist'
import AddWaitlist from '../AddWaitlist'
import BookReservation from '../BookReservation'
import { ReactComponent as WaitlistIcon } from './assets/user-clock-solid.svg'
import { ReactComponent as BookIcon } from './assets/book-open-solid.svg'
import { ReactComponent as LeftCaret } from './assets/caret-left-solid.svg'
import { ReactComponent as DownCaret } from './assets/caret-down-solid.svg'
import { Modal } from '../../../context/Modal'

const LeftPanel = () => {
    const [viewBooked, setViewBooked] = useState(true);
    const [viewWaitlist, setViewWaitlist] = useState(true);
    const [showAddWaitlist, setShowAddWaitlist] = useState(false);
    const [bookRes, setBookRes] = useState(null);
    const [editWaitlist, setEditWaitlist] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('time')
    const [order, setOrder] = useState('asc')
    // 'time', 'guest', 'party-size', 'section', 'status', 'updated', 'created'

    return (
        <div className={style.left_panel}>
            <input onChange={(e)=>setSearchTerm(e.target.value)} placeholder='search name phone or email' value={searchTerm} className={style.search}></input>
            <div className={style.filter_bar}>
                <label id={style.sort_by} htmlFor='sort-select'>Sort By</label>
                <select onChange={(e)=>setSort(e.target.value)} value={sort} id='sort_select' name="sort" className={style.sort_by}>
                    <option value="time">Time</option>
                    <option value="guest">Guest</option>
                    <option value="party-size">Party Size</option>
                    <option value="section">Section</option>
                    <option value="status">Status</option>
                    <option value="updated">Updated</option>
                    <option value="created">Created</option>
                </select>
                <div id={style.order}>
                   <div id={style.asc} className={order === 'asc' ? style.order_select : null} onClick={()=>setOrder('asc')} >{'ASC'}</div>
                   <div id={style.desc} className={order === 'desc' ? style.order_select : null} onClick={()=>setOrder('desc')} >{'DESC'}</div>
                </div>
            </div>
            <div className={style.booked_bar}>
                <div className={style.label}> Booked </div>
                <div onClick={() => setBookRes('new')} className={style.add_button}>
                    <BookIcon className={style.icon}/>
                    <div className={style.label}>Add</div>
                </div>
                {viewBooked &&
                    <div className={style.caret_icon_sizer}>
                        <DownCaret onClick={() => {setViewBooked(false)}} className={`${style.icon} ${style.caret}`}/>
                    </div>
                }
                {!viewBooked &&
                    <div className={style.caret_icon_sizer}>
                        <LeftCaret onClick={() => {setViewBooked(true)}} className={`${style.icon} ${style.caret}`}/>
                    </div>
                }
            </div>
            {viewBooked && <ResList searchTerm={searchTerm} sort={sort} order={order} bookRes={bookRes} setBookRes={setBookRes}/>}
            <div className={style.waitlist_bar}>
                <div className={style.label}>Waitlist</div>
                <div onClick={() => {setShowAddWaitlist(true)}} className={style.add_button}>
                    <WaitlistIcon className={style.icon}/>
                    <div className={style.label}>Add</div>
                </div>
                {viewWaitlist &&
                    <div className={style.caret_icon_sizer}>
                        <DownCaret onClick={() => {setViewWaitlist(false)}} className={`${style.icon} ${style.caret}`}/>
                    </div>
                }
                {!viewWaitlist &&
                    <div className={style.caret_icon_sizer}>
                        <LeftCaret onClick={() => {setViewWaitlist(true)}} className={`${style.icon} ${style.caret}`}/>
                    </div>
                }
            </div>
            {viewWaitlist && <Waitlist searchTerm={searchTerm} sort={sort} order={order} setEditWaitlist={setEditWaitlist}/>}
            {bookRes &&
                <Modal onClose={() => setBookRes(false)}>
                    <BookReservation setBookRes={setBookRes} bookRes={bookRes}/>
                </Modal>}
            {showAddWaitlist &&
                <Modal onClose={()=> setShowAddWaitlist(false)}>
                    <AddWaitlist setShowAddWaitlist={setShowAddWaitlist} showAddWaitlist={showAddWaitlist}/>
                </Modal>
            }
            {editWaitlist &&
                <Modal onClose={()=> setEditWaitlist(false)}>
                    <AddWaitlist setEditWaitlist={setEditWaitlist} editWaitlist={editWaitlist}/>
                </Modal>
            }
        </div>
    )
}

export default LeftPanel;
