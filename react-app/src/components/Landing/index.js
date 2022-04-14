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

const Landing = () => {
    Settings.defaultZone = "America/New_York"
    const local = DateTime.local().startOf('day')
    const [selectedDate, setSelectedDate] = useState(local);
    const [availableTables, setavailableTables] = useState([]);
    // const [showDatePicker, setShowDatePicker] = useState(false)
    const [dateArray, setDateArray] = useState([])
    const [showGuestReserveModal, setShowGuestReserveModal] = useState(false);

    // establishment
    const getSevenDays = (date) => {
        const result = Array(7).fill(0).map((_, i) => {
            return date.plus({days: i})
        })
        return result;
    }

    useEffect(() => {
        setDateArray(getSevenDays(selectedDate));
        fetch('/api/reservations/Village_Baker-1/availability', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"client_date": selectedDate.toISO()})
        }).then(async (response) => {
            const data = await response.json()
            setavailableTables(data.available_tables)
            return
        }).catch((e) => {
            console.error(e)
        })
    },[selectedDate, setavailableTables])

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
                    <div id={style.date_selection_bar}>
                    {/* <SingleDatePicker
                    id="datePicker"
                    date={moment(selectedDate)}
                    onDateChange={date => {
                        const newDate = date.toDate();
                        newDate.setHours(0,0,0,0)
                        setSelectedDate(newDate)}}
                    focused={showDatePicker}
                    onFocusChange={({focused}) => setShowDatePicker(focused)}
                    /> */}
                        {dateArray.map((date, index)=>{
                            // console.log("DATE LOG: ", date)
                            return(
                            <div
                            key={date}
                            id={index}
                            className={selectedDate.toMillis() === DateTime.local().startOf('day').toMillis() ? style.date_selection_active : style.date_selection}
                            onClick={()=>setSelectedDate(date)}
                            >{date.toLocaleString({month: 'short', day: 'numeric'})}</div>)})}
                    </div>
                    {!availableTables.length && <div> No tables available. Please select a new date.</div>}
                    {availableTables.length && <div id={style.availability_grid}>

                        {availableTables.map((table, i)=>{
                            return(
                            <React.Fragment key={`${table.res_time}_${table.table_details.id}`}>
                            <div onClick={() => setShowGuestReserveModal(i)} className={style.avail_table_cell}>
                                <div>{DateTime.fromISO(table.res_time).toLocaleString({hour: '2-digit', minute: '2-digit'})}</div>
                                <div>{table.table_details.table_name}</div>
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
