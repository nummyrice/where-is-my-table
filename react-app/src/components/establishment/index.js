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
import * as reservationActions from "../../store/reservations";
import * as waitlistActions from "../../store/selectedDateWaitlist";

export const EstablishmentContext = createContext();
let socket;
// const CONNECTION = 'localhost:3000'
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
        socket.emit('join', `establishment_${establishment.id}`)
        socket.on("status", (data) => {
            console.log("FROM SERVER: ", data.msg)
        })
        socket.on('new_reservation', newRes => {
            dispatch(reservationActions.setRes(newRes))
        })
        socket.on('update_reservation', updatedRes => {
            dispatch(reservationActions.setUpdatedRes(updatedRes))
        })
        socket.on('remove_tag', data => {
            dispatch(reservationActions.setRemoveTag(data.res_id, data.tag_id))
        })
        socket.on('new_party', newParty => {
            dispatch(waitlistActions.setParty(newParty))
        })
        socket.on('update_party',updatedParty => {
            dispatch(waitlistActions.updateParty(updatedParty))
        })
        socket.on('remove_party_tag', data => {
            dispatch(waitlistActions.setRemoveTag(data.party_id, data.tag_id))
        })
        socket.on('error', ()=> {
            console.log("error from socket")
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
