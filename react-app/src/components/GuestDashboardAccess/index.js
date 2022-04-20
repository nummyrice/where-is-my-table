import React from 'react'
import { useDispatch } from 'react-redux';
import style from './GuestDashboardAccess.module.css'
import { login } from '../../store/session';
import { getEstablishment } from '../../store/establishment';
import { useHistory } from 'react-router-dom';


const GuestDashboardAccess = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const demoEstablishmentLogin = () => {
        dispatch(login('establishment_demo@aa.io', 'password1'))
        .then(data => {
          if (data.establishment_id) dispatch(getEstablishment(data.establishment_id)).then(() => history.push('/establishment'))
        })
      };

    return(
        <div className={style.frame}>
            <p>After creating your account and setting up your restaurant details you will have access to your very own dashboard to manage your restaurants and waitlist.</p>
            <button onClick={demoEstablishmentLogin} className={`${style.custom_btn} ${style.btn_9}`}>Check it out</button>
        </div>
    )
}
export default GuestDashboardAccess;
