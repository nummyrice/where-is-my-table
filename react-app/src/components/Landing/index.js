import React, {useEffect, useState} from 'react';
import GuestReserveModal from '../GuestReserveModal';
import style from './Landing.module.css';
import bread from './assets/bread.png';
import chili from './assets/chili.png';
import pie from './assets/pie.png';
import { ReactComponent as Food1} from './assets/food1.svg';
import { ReactComponent as Food2 } from './assets/food2.svg';
import guest_pic from './assets/guest_pic.png';
import establishment_pic from './assets/establishment_pic.png';
import githubLogo from './assets/github.png';
import linkedinLogo from './assets/linkedin.png';
import { DateTime, Settings } from 'luxon';
import DateAdapter from '@mui/lab/AdapterLuxon';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

const Landing = () => {
    Settings.defaultZone = "America/New_York"
    const local = DateTime.local().startOf('day')
    const dateArray = Array(7).fill(0).map((_, i) => {
        return local.plus({days: i})
    })
    const [selectedDate, setSelectedDate] = useState(local);
    const [availableTables, setavailableTables] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showGuestReserveModal, setShowGuestReserveModal] = useState(false);
    const [guestFilter, setGuestFilter] = useState('number of')
    const [filteredTables, setFilteredTables] = useState([]);

    const guestFilterOptions = Array(20).fill(0).map((_, i) => {
        if (i === 0) return 'number of'
        return _ + i
    })

    useEffect(() => {
        fetch('/api/reservations/Village_Baker-1/availability', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"client_date": selectedDate.toISO()})
        }).then(async (response) => {
            const data = await response.json()
            setavailableTables(data.available_tables)
            setFilteredTables(data.available_tables)
            return
        }).catch((e) => {
            console.error(e)
        })
    },[selectedDate, setavailableTables])


    useEffect(() => {
            if (guestFilter === 'number of') return setFilteredTables(availableTables)
            return setFilteredTables(availableTables.filter(table => {
                return guestFilter >= table.table_details.min_seat && guestFilter <= table.table_details.max_seat
            }))
        }, [guestFilter])

    return(
        <div className={style.landing_main}>
            <div id={style.intro_section}>
                <img alt='bread' src={bread}id={style.bread_icon} className={style.icon}></img>
                <img alt='chili' src={chili}id={style.chili_icon} className={style.icon}></img>
                <img alt='pie' src={pie}id={style.pie_icon} className={style.icon}></img>
                <Food1 id={style.food1_icon} className={style.icon}/>
                <Food2 id={style.food2_icon} className={style.icon}/>
                <p id={style.intro} className={style.txt}>Let tableGater manage your table reservations. Keep the phone lines open and save time by allowing customers to join the waitlist or book a table right from your website.</p>
                <div id={style.links_section}>
                    <a href={"https://github.com/nummyrice"} id={style.github}>
                        <img alt='github logo' src={githubLogo}></img>
                        <div>nummyRice</div>
                    </a>
                    <a href={"http://www.linkedin.com/in/nicholas-rice-7b7aba93"} id={style.linkedIn}>
                    <img alt='linkedin logo' src={linkedinLogo}></img>
                        <div>Nicholas Rice</div>
                    </a>
                </div>
            </div>
            <div id={style.feature_section}>
                <p className={style.txt} id={style.features_description}>With this demo app you can either explore availablity as a guest looking to reserve a table or gain establishment access and use tableGater's robust reservation system as a restaurant employee.</p>
                <img src={guest_pic} alt='guest' id={style.example_image_1}></img>
                <p className={style.txt} id={style.guest_example}>Create an account, login or use our demo guest. Then you can browse our table availability</p>
                <img src={establishment_pic} alt='establishment' id={style.example_image_2}></img>
                <p className={style.txt} id={style.esatablishment_example}>...or login as our demo establishment as an employee and manage/view reservations.</p>
                <div id={style.availability_section}>
                    <div id={style.avail_sec_title}>Reserve a Table...</div>
                    <div id={style.res_params_selector}>
                        <div id={style.res_guest_param_container}>
                            <label htmlFor={'guestNum'}>{"Guests"}</label>
                            <select id={style.guest_num_selector} value={guestFilter} name={"guestNum"} onChange={(e)=>setGuestFilter(e.target.value)}>
                                {guestFilterOptions.map((guestNum) => {
                                    return(
                                        <option key={`guests_${guestNum}`} value={guestNum}>{guestNum === 1 ? `${guestNum} guest` : `${guestNum} guests`}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div id={style.res_date_param_container}>
                            <label htmlFor={'date'}>{"Date"}</label>
                            <LocalizationProvider dateAdapter={DateAdapter}>
                                <DesktopDatePicker
                                    open={showDatePicker}
                                    label="Date desktop"
                                    inputFormat="MM/dd/yyyy"
                                    value={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    renderInput={(params) => <TextField {...params}
                                    sx={{
                                        '.MuiOutlinedInput-input': {
                                            'display': 'hidden',
                                            'backgroundColor': '#444',
                                            'color': '#fff',
                                            'height': '5px',
                                            'margin': '3px',
                                            "border": "none",
                                            "borderRadius": "6px"
                                        },
                                        '.MuiInputLabel-root': {
                                            'display': 'none'
                                        },
                                        // '.MuiInputAdornment-root': {
                                        //     'border': 'none'
                                        // },
                                        '.MuiButtonBase-root': {
                                            'color': 'black'
                                        },
                                        '.MuiButtonBase-root:hover': {
                                            'color': '#808080',
                                            'cursor': 'pointer'
                                        },
                                        '.MuiButtonBase-root svg': {
                                            'height': '1.5em',
                                            'width': '1.5em'
                                        },
                                        // '.MuiFormControl-root': {
                                        //     'border': 'none'
                                        // },
                                        '.MuiOutlinedInput-notchedOutline': {
                                            'border': 'none'
                                        }
                                    }} />}
                                />
                            </LocalizationProvider>
                        </div>
                </div>
                    <div id={style.date_selection_bar}>
                        {dateArray.map((date, index)=>{
                            // console.log("DATE LOG: ", date)
                            return(
                            <div
                                key={date}
                                className={`${style.date_selection} ${selectedDate.toMillis() === date.toMillis() ? style.date_selection_active : null}`}
                                onClick={()=>setSelectedDate(date)}
                            >
                                {date.toLocaleString({month: 'short', day: 'numeric'})}
                            </div>)})}
                            <div
                                className={`${style.date_selection}`}
                                onClick={()=> setShowDatePicker(!showDatePicker)}
                            >
                                {"..."}
                            </div>
                    </div>
                    {!filteredTables.length && <div> No tables available. Please select a new date.</div>}
                    {filteredTables.length && <div id={style.availability_grid}>

                        {filteredTables.map((table, i)=>{
                            return(
                            <React.Fragment key={`${table.res_time}_${table.table_details.id}`}>
                            <div onClick={() => setShowGuestReserveModal(i)} className={style.avail_table_cell}>
                                <div className={style.avail_table_cell_date}>{DateTime.fromISO(table.res_time).toLocaleString({hour: '2-digit', minute: '2-digit'})}</div>
                                <div className={style.avail_table_cell_name}>{table.table_details.table_name}</div>
                            </div>
                            {showGuestReserveModal === i &&
                            <GuestReserveModal
                                availableTableTime={table}
                                setShowGuestReserveModal={setShowGuestReserveModal}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                />}
                            </React.Fragment>)
                        })}</div>}
                </div>
            </div>
        </div>
    )
}

export default Landing;
