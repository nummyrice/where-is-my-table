import React, { useState, useEffect, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReservations } from '../../store/reservations';
import { getSelectedDateWaitlist } from '../../store/selectedDateWaitlist';
import style from "./Establishment.module.css";
// import { Route, Redirect } from 'react-router-dom';
import ResSchedule from './ResSchedule';
import TopBar from './TopBar';
import LeftPanel from './LeftPanel';
import { DateTime, Settings } from 'luxon';
import { io } from "socket.io-client";

export const EstablishmentContext = createContext();
let socket;
const Establishment = () => {
    const establishment = useSelector(state => state.session.user.establishment)
    const dispatch = useDispatch();
    Settings.defaultZone = establishment.timezone.luxon_string
    // const user = useSelector(state => state.session.user)
    const local = DateTime.local().startOf('day')
    const [selectedDate, setSelectedDate] = useState(local);
    useEffect(() => {
        dispatch(getReservations(selectedDate.toISO())).then((data)=>{
            // console.log("SELECTED DATA ISO: ", selectedDate.toISOString() )
        })
        dispatch(getSelectedDateWaitlist(selectedDate.toISO())).then((data) => {
            // console.log("Waitlist DATA", data)
        })
    }, [selectedDate, dispatch])

    useEffect(()=>{
        socket = io()
        socket.on("connect", ()=>{
            console.log('successfully connected web socket')
        })
        socket.emit('join', `establishment_${establishment.id}`)
        socket.on("my response", (data) => {
            console.log(data)
        })
        return () => socket.disconnect();
    }, [])
    return (
        <EstablishmentContext.Provider value={{selectedDate, setSelectedDate}}>
            <div className={style.establishment}>
                    <TopBar/>
                    <LeftPanel/>
                    <ResSchedule selectedDate={selectedDate}/>
            </div>
        </EstablishmentContext.Provider>
    )
}

export default Establishment;
