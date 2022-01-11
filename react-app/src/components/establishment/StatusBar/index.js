import React, {useState} from 'react';
import style from './StatusBar.module.css'
import { ReactComponent as CancelIcon } from './assets/times-circle-regular.svg';
import { ReactComponent as LateIcon } from './assets/exclamation-circle-solid.svg';
import { ReactComponent as PSIcon } from './assets/dot-circle-solid.svg';
import { ReactComponent as PAIcon } from './assets/dot-circle-regular.svg';
import { ReactComponent as ArrivedIcon } from './assets/check-circle-regular.svg';
import { ReactComponent as SeatedIcon } from './assets/check-circle-solid.svg';
import { ReactComponent as ReservedIcon } from './assets/circle-solid.svg';
import { ReactComponent as LeftMessageIcon } from './assets/spinner-solid.svg';

const StatusBar = ({reservationId, statusId}) => {
    const [selectedStatus, setSelectedStatus] = useState(statusId)
    const handleStatusChange = async (newStatusId) => {
        if (newStatusId !== selectedStatus) {
            const response = await fetch('/api/reservations/status/update', {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"reservation_id": reservationId, "status_id": newStatusId})
            })

            const data = await response.json();

            if (data.result) {
                setSelectedStatus(data.reservation.status_id);
            }
            return data;
        }
    }
    // TODO: add confirmation modal when cancelled status is selected. Cancel should lock all status changes and rerender ResSchedule
    return(
        <div className={style.status_bar}>
            <div className={selectedStatus === 3 ? style.selected : style.status_reserved}
            onClick={() => {
                handleStatusChange(3);
            }}>
                <ReservedIcon className={style.icon}></ReservedIcon>
                <div className={style.txt}>Reserved</div>
            </div>
            <div className={selectedStatus === 4 ? style.selected : style.status_lm}
            onClick={() => {
                handleStatusChange(4);
            }}>
                <LeftMessageIcon className={style.icon}></LeftMessageIcon>
                <div className={style.txt}>Left Message</div>
            </div>
            <div className={selectedStatus === 6 ? style.selected : style.status_late}
            onClick={() => {
                handleStatusChange(6);
            }}>
                <LateIcon className={style.icon}></LateIcon>
                <div className={style.txt}>Late</div>
            </div>
            <div className={selectedStatus === 7 ? style.selected : style.status_pa}
            onClick={() => {
                handleStatusChange(7);
            }}>
                <PAIcon className={style.icon}></PAIcon>
                <div className={style.txt}>Partially Arrived</div>
            </div>
            <div className={selectedStatus === 8 ? style.selected : style.status_a}
            onClick={() => {
                handleStatusChange(8);
            }}>
                <ArrivedIcon className={style.icon}></ArrivedIcon>
                <div className={style.txt}>Arrived</div>
            </div>
            <div className={selectedStatus === 9 ? style.selected : style.status_ps}
            onClick={() => {
                handleStatusChange(9);
            }}>
                <PSIcon className={style.icon}></PSIcon>
                <div className={style.txt}>Partially Seated</div>
            </div>
            <div className={selectedStatus === 10 ? style.selected : style.status_s}
            onClick={() => {
                handleStatusChange(10);
            }}>
                <SeatedIcon className={style.icon}></SeatedIcon>
                <div className={style.txt}>Seated</div>
            </div>
            <div className={selectedStatus === 11 ? style.selected : style.status_ca}
            onClick={() => {
                handleStatusChange(11);
            }}>
                <CancelIcon className={style.icon}></CancelIcon>
                <div className={style.txt}>Cancelled</div>
            </div>

        </div>
    )
}

export default StatusBar;
